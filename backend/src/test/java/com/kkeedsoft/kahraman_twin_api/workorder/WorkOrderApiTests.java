package com.kkeedsoft.kahraman_twin_api.workorder;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(properties = "spring.security.user.password=test-only-password")
@ActiveProfiles("local")
@AutoConfigureMockMvc
class WorkOrderApiTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    private static final String BODY = """
            {"product":"TEST Ürün","customer":"Test müşteri","qty":100,
             "deadline":"2026-10-15","machine":"TEST-01"}
            """;

    @Test
    void authenticationAndRoleAreRequired() throws Exception {
        mvc.perform(get("/api/work-orders")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/work-orders").with(user("reader").roles("READER")))
                .andExpect(status().isForbidden());
        mvc.perform(get("/api/work-orders").with(httpBasic("developer", "wrong-password")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void readsSeedAndFiltersWithPagination() throws Exception {
        mvc.perform(get("/api/work-orders").param("q", "WO-2026-1048").param("risk", "critical")
                .param("page", "0").param("size", "1").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].id").value("WO-2026-1048"));
        mvc.perform(get("/api/work-orders/WO-2026-1048").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.deadline").value("2026-09-10"));
        mvc.perform(get("/api/work-orders").param("q", "no-such-work-order")
                .with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void missingOrderIsProblemDetail() throws Exception {
        mvc.perform(get("/api/work-orders/missing").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void writesRequireCsrf() throws Exception {
        mvc.perform(post("/api/work-orders").with(user("dev").roles("DEVELOPER"))
                .contentType(MediaType.APPLICATION_JSON).content(BODY)).andExpect(status().isForbidden());
    }

    @Test
    void realBasicAuthAndCsrfTokenCanCreate() throws Exception {
        var tokenResult = mvc.perform(get("/api/csrf").with(httpBasic("developer", "test-only-password")))
                .andExpect(status().isOk()).andReturn();
        var token = mapper.readTree(tokenResult.getResponse().getContentAsString());
        var session = (MockHttpSession) tokenResult.getRequest().getSession(false);
        mvc.perform(post("/api/work-orders").session(session)
                .with(httpBasic("developer", "test-only-password"))
                .header(token.get("headerName").asText(), token.get("token").asText())
                .contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isCreated()).andExpect(header().exists("Location"));
    }

    @Test
    void createUpdateProgressAndRejectInconsistentChanges() throws Exception {
        var created = mvc.perform(post("/api/work-orders").with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.done").value(0)).andReturn();
        String location = created.getResponse().getHeader("Location");
        mvc.perform(patch(location + "/progress").with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"done\":40}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.done").value(40));
        // Aynı toplamın yeniden gönderilmesi üretimi iki kez artırmaz.
        mvc.perform(patch(location + "/progress").with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"done\":40}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.done").value(40));
        mvc.perform(put(location).with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content(BODY.replace("100", "200")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.qty").value(200))
                .andExpect(jsonPath("$.done").value(40));
        mvc.perform(put(location).with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content(BODY.replace("100", "10")))
                .andExpect(status().isBadRequest());
        mvc.perform(patch(location + "/progress").with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"done\":201}"))
                .andExpect(status().isBadRequest());
        mvc.perform(get(location).with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.qty").value(200))
                .andExpect(jsonPath("$.done").value(40));
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"qty\":-1}", "{invalid", "{\"done\":-1}"})
    void invalidCreateBodiesAreRejected(String body) throws Exception {
        mvc.perform(post("/api/work-orders").with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @ParameterizedTest
    @ValueSource(strings = {"?page=-1", "?size=0", "?size=101", "?risk=invalid", "?page=abc"})
    void invalidQueryIsRejected(String query) throws Exception {
        mvc.perform(get("/api/work-orders" + query).with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void invalidDateAndProgressAreRejected() throws Exception {
        mvc.perform(post("/api/work-orders").with(user("dev").roles("DEVELOPER"))
                .with(csrf()).contentType(MediaType.APPLICATION_JSON).content(BODY.replace("2026-10-15", "15.10.2026")))
                .andExpect(status().isBadRequest());
        for (String body : new String[] {"{}", "{\"done\":-1}"}) {
            mvc.perform(patch("/api/work-orders/WO-2026-1048/progress").with(user("dev").roles("DEVELOPER"))
                    .with(csrf()).contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest());
        }
    }
}
