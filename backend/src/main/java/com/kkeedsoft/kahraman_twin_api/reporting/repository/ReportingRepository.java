package com.kkeedsoft.kahraman_twin_api.reporting.repository;

import com.kkeedsoft.kahraman_twin_api.reporting.model.ReportSnapshot;

public interface ReportingRepository {
    ReportSnapshot snapshot();
}
