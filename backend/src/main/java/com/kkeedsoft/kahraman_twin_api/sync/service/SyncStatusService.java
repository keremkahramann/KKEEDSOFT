package com.kkeedsoft.kahraman_twin_api.sync.service;

import com.kkeedsoft.kahraman_twin_api.reporting.repository.ReportingRepository;
import com.kkeedsoft.kahraman_twin_api.sync.model.SyncStatus;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("local")
public class SyncStatusService {
    private final ReportingRepository repository;
    public SyncStatusService(ReportingRepository repository) { this.repository = repository; }
    public SyncStatus status() {
        var snapshot = repository.snapshot();
        return new SyncStatus("NOT_CONFIGURED", snapshot.dataSource(), snapshot.dataVersion(),
                snapshot.lastSuccessfulSyncAt(), null,
                "Yerel örnek veri. Kaynak veritabanı ve periyodik aktarım henüz yapılandırılmadı.");
    }
}
