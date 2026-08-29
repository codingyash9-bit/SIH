package in.gov.bharatanpr.operations;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "${dashboard.origin:http://localhost:5173}")
public class OperationsController {
  record Alert(String id, String plate, String title, String severity, String status,
               int confidence, String assignedTo, String ruleVersion) {}
  record CaseRecord(String id, String plate, String title, String status, int priority,
                    String owner, List<String> auditEvents) {}
  record StatusChange(String status, String reason) {}

  private final Map<String, Alert> alerts = new ConcurrentHashMap<>();
  private final Map<String, CaseRecord> cases = new ConcurrentHashMap<>();

  public OperationsController() {
    alerts.put("ALT-2041", new Alert("ALT-2041", "DL 8C AB 6214", "Suspected clone pair", "critical", "new", 94, "Unassigned", "clone-feasibility/1.4.2"));
    alerts.put("ALT-2039", new Alert("ALT-2039", "HR 26 DK 9081", "Registry colour mismatch", "review", "in_review", 87, "Arjun Sharma", "attribute-match/2.1.0"));
    cases.put("CASE-DL-2026-031", new CaseRecord("CASE-DL-2026-031", "DL 8C AB 6214", "Clone feasibility review", "live", 1, "Arjun Sharma", new ArrayList<>(List.of("Case opened from ALT-2041"))));
  }

  @GetMapping("/health")
  Map<String, Object> health() { return Map.of("status", "ok", "mode", "simulation", "time", Instant.now()); }

  @GetMapping("/alerts")
  List<Alert> alerts(@RequestParam(required = false) String status) {
    return alerts.values().stream().filter(a -> status == null || a.status().equals(status)).toList();
  }

  @PatchMapping("/alerts/{id}")
  ResponseEntity<Alert> updateAlert(@PathVariable String id, @RequestBody StatusChange change) {
    Alert current = alerts.get(id);
    if (current == null) return ResponseEntity.notFound().build();
    Alert updated = new Alert(current.id(), current.plate(), current.title(), current.severity(), change.status(), current.confidence(), "Arjun Sharma", current.ruleVersion());
    alerts.put(id, updated);
    return ResponseEntity.ok(updated);
  }

  @GetMapping("/cases")
  List<CaseRecord> cases(@RequestParam(required = false) String status) {
    return cases.values().stream().filter(c -> status == null || c.status().equals(status)).toList();
  }

  @PatchMapping("/cases/{id}")
  ResponseEntity<CaseRecord> updateCase(@PathVariable String id, @RequestBody StatusChange change) {
    CaseRecord current = cases.get(id);
    if (current == null) return ResponseEntity.notFound().build();
    List<String> audit = new ArrayList<>(current.auditEvents());
    audit.add(Instant.now() + " · " + change.status() + " · " + change.reason());
    CaseRecord updated = new CaseRecord(current.id(), current.plate(), current.title(), change.status(), current.priority(), current.owner(), audit);
    cases.put(id, updated);
    return ResponseEntity.ok(updated);
  }
}

