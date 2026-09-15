package com.kkeedsoft.kahraman_twin_api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = "spring.security.user.password=test-only-password")
@ActiveProfiles("local")
class KahramanTwinApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
