package com.kkeedsoft.kahraman_twin_api.performance;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "spring.security.user.password=test-only-password")
@ActiveProfiles("local")
@AutoConfigureMockMvc
class ReportingApiTests {
    @Autowired MockMvc mvc;
    private static final String RANGE = "?from=2026-09-21&to=2026-09-21";

    @ParameterizedTest
    @ValueSource(strings = {"/api/v1/employees", "/api/v1/operations", "/api/v1/production/measurements",
            "/api/v1/performance/employees/top", "/api/v1/performance/employees/bottom",
            "/api/v1/performance/operations/bottom", "/api/v1/sync/status", "/api/v1/work-orders", "/api/v1/auth/csrf"})
    void allCategoriesRequireAuthenticationAndRole(String path) throws Exception {
        mvc.perform(get(path)).andExpect(status().isUnauthorized());
        mvc.perform(get(path).with(user("reader").roles("READER"))).andExpect(status().isForbidden());
    }

    @Test
    void catalogsAreSearchablePagedAndHaveDetails() throws Exception {
        mvc.perform(get("/api/v1/employees?q=ayşe&size=1").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].id").value("EMP-002"))
                .andExpect(jsonPath("$.dataSource").value("LOCAL_DEMO"));
        mvc.perform(get("/api/v1/employees/EMP-001").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.departmentCode").value("URETIM"));
        mvc.perform(get("/api/v1/operations?page=1&size=2").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(6))
                .andExpect(jsonPath("$.items[0].id").value("OP-003"));
        mvc.perform(get("/api/v1/operations/OP-001").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("KES-01"));
        mvc.perform(get("/api/v1/operations/no-such-id").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void performanceFiltersAndMetadataAreExposed() throws Exception {
        mvc.perform(get("/api/v1/performance/employees/top" + RANGE).with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items.length()").value(5))
                .andExpect(jsonPath("$.items[0].id").value("EMP-002"))
                .andExpect(jsonPath("$.metadata.timeZone").value("Europe/Istanbul"))
                .andExpect(jsonPath("$.metadata.scoreRule").value("ALL_NUMERIC"));
        mvc.perform(get("/api/v1/performance/employees/bottom" + RANGE + "&limit=1").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items[0].id").value("EMP-006"));
        mvc.perform(get("/api/v1/performance/operations/bottom" + RANGE + "&operationId=OP-001").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items[0].averageScore").value(100))
                .andExpect(jsonPath("$.items[0].measurementCount").value(1))
                .andExpect(jsonPath("$.metadata.nonPositiveMeasurements").value(2))
                .andExpect(jsonPath("$.metadata.dataSource").value("LOCAL_DEMO"));
        mvc.perform(get("/api/v1/performance/employees/top" + RANGE + "&employeeId=missing").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "?from=2026-09-22&to=2026-09-21", "?from=bad&to=2026-09-21",
            "?from=2026-09-21&to=2026-09-21&limit=0", "?from=2026-09-21&to=2026-09-21&limit=101"})
    void invalidPerformanceQueriesReturn400(String query) throws Exception {
        mvc.perform(get("/api/v1/performance/operations/bottom" + query).with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void productionMeasurementsArePagedAndDoNotFilterOutZero() throws Exception {
        mvc.perform(get("/api/v1/production/measurements" + RANGE + "&employeeId=EMP-001&size=2")
                .with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(3))
                .andExpect(jsonPath("$.items[1].performanceScore").value(0));
        mvc.perform(get("/api/v1/production/measurements" + RANGE + "&size=101").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/v1/production/measurements?from=2026-09-22&to=2026-09-21").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/v1/employees?page=-1").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void syncDoesNotPretendToHaveImportedDataAndVersionedLegacyRoutesWork() throws Exception {
        mvc.perform(get("/api/v1/sync/status").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.state").value("NOT_CONFIGURED"))
                .andExpect(jsonPath("$.lastSuccessfulSyncAt").isEmpty())
                .andExpect(jsonPath("$.nextScheduledAt").isEmpty());
        mvc.perform(get("/api/v1/work-orders").with(user("dev").roles("DEVELOPER"))).andExpect(status().isOk());
        mvc.perform(get("/api/v1/auth/csrf").with(user("dev").roles("DEVELOPER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty());
    }
}
