# OWASP Core Rule Set (CRS) - Overview and Default Rules

## What is the OWASP CRS?
The **OWASP Core Rule Set (CRS)** is a set of generic ModSecurity rules designed to protect web applications from a wide range of common attack vectors. It includes pre-defined rules for detecting and blocking threats such as SQL injection, cross-site scripting (XSS), local file inclusion (LFI), and more.

---

## Default Included Rule Categories
The OWASP CRS organizes its rules into several files, each targeting specific types of attacks or tasks. Below is a list of the primary rule files and their purposes:

### **1. crs-setup.conf**
- **Purpose:** Configuration file, not a set of rules.
- **Use:** Provides global configurations for enabling/disabling specific protections, setting thresholds, and other tuning options.
- **Example:** 
  - Define application-specific parameters.
  - Control the severity level for logging.

---

### **2. REQUEST-901-INITIALIZATION.conf**
- **Purpose:** Ensures proper initialization of CRS.
- **Use:** Prepares ModSecurity for the rest of the rules by defining essential variables.
- **Example:** 
  - Sets up collections (e.g., `tx` for transaction-specific data).

---

### **3. REQUEST-905-COMMON-EXCEPTIONS.conf**
- **Purpose:** Contains rules to exclude certain requests from being inspected.
- **Use:** Prevents false positives by ignoring trusted sources or paths.
- **Example:** 
  - Allows health checks (`/health-check`).

---

### **4. REQUEST-910-IP-REPUTATION.conf**
- **Purpose:** Protects against requests from known malicious IP addresses.
- **Use:** Integrates with third-party IP reputation services.
- **Example:** 
  - Block requests from blacklisted IP ranges.

---

### **5. REQUEST-911-METHOD-ENFORCEMENT.conf**
- **Purpose:** Enforces restrictions on HTTP methods.
- **Example:** 
  - Block unsupported methods like `TRACE` or `TRACK`.

---

### **6. REQUEST-913-SCANNER-DETECTION.conf**
- **Purpose:** Detects automated scanners and bots.
- **Example:** 
  - Matches known patterns of scanning tools.

---

### **7. REQUEST-920-PROTOCOL-ENFORCEMENT.conf**
- **Purpose:** Validates the HTTP protocol to prevent malformed or malicious requests.
- **Example:** 
  - Enforces proper header structure.

---

### **8. REQUEST-921-PROTOCOL-ATTACK.conf**
- **Purpose:** Protects against protocol-based attacks.
- **Example:** 
  - Detects header injection or HTTP smuggling attempts.

---

### **9. REQUEST-930-APPLICATION-ATTACK-LFI.conf**
- **Purpose:** Detects **Local File Inclusion (LFI)** attacks.
- **Example:** 
  - Blocks requests trying to access files like `/etc/passwd`.

---

### **10. REQUEST-931-APPLICATION-ATTACK-RFI.conf**
- **Purpose:** Protects against **Remote File Inclusion (RFI)** attacks.
- **Example:** 
  - Blocks requests with malicious external URLs.

---

### **11. REQUEST-932-APPLICATION-ATTACK-RCE.conf**
- **Purpose:** Detects **Remote Code Execution (RCE)** attempts.
- **Example:** 
  - Blocks requests containing code execution patterns like `eval()` or `system()`.

---

### **12. REQUEST-933-APPLICATION-ATTACK-PHP.conf**
- **Purpose:** Protects against attacks targeting PHP applications.
- **Example:** 
  - Blocks malicious PHP-specific patterns.

---

### **13. REQUEST-941-APPLICATION-ATTACK-XSS.conf**
- **Purpose:** Detects **Cross-Site Scripting (XSS)** attacks.
- **Example:** 
  - Blocks requests containing `<script>` tags or JavaScript code.

---

### **14. REQUEST-942-APPLICATION-ATTACK-SQLI.conf**
- **Purpose:** Protects against **SQL Injection (SQLi)** attacks.
- **Example:** 
  - Blocks requests containing SQL keywords like `SELECT`, `UNION`, or `DROP`.

---

### **15. REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION.conf**
- **Purpose:** Detects session fixation and hijacking attempts.
- **Example:** 
  - Blocks attempts to set cookies via malicious requests.

---

### **16. REQUEST-944-APPLICATION-ATTACK-JAVA.conf**
- **Purpose:** Detects attacks targeting Java applications.
- **Example:** 
  - Blocks requests containing Java serialization vulnerabilities.

---

### **17. REQUEST-949-BLOCKING-EVALUATION.conf**
- **Purpose:** Evaluates whether to block a request based on previous rules.
- **Example:** 
  - Applies thresholds and scores from earlier rules to decide if the request should be blocked.

---

### **18. RESPONSE-950-DATA-LEAKAGES.conf**
- **Purpose:** Detects data leakage in server responses.
- **Example:** 
  - Blocks responses containing sensitive data like credit card numbers or SSNs.

---

### **19. RESPONSE-951-DATA-LEAKAGES-SQL.conf**
- **Purpose:** Detects SQL error messages in server responses.
- **Example:** 
  - Blocks responses revealing database errors.

---

### **20. RESPONSE-980-CORRELATION.conf**
- **Purpose:** Allows for correlation between rules and transactions.
- **Example:** 
  - Logs detailed information for analyzing multiple rules triggering simultaneously.

---

## How to Enable the OWASP CRS

1. **Include the CRS in `modsecurity.conf`:**

   ```conf
   Include /usr/local/modsecurity-crs/crs-setup.conf
   Include /usr/local/modsecurity-crs/rules/*.conf
   ```

1. **Customize the `crs-setup.conf`:**

    - Configure thresholds, exclusions, and parameters based on your application.

1. **Test with Traffic:**

    - Monitor logs to identify false positives or necessary adjustments.
    - Use tools like curl or penetration testing tools (e.g., OWASP ZAP).
