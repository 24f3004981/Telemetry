# 07 — Demo Scenarios & 3-Minute Presentation Script

## 1. Seed Datasets (Tiger Data Fixtures)

### Scenario 1: NordBank (Primary Demo Star)
- **Industry**: Financial Services & Tier-1 Retail Banking
- **Region**: European Union (Frankfurt / Dublin)
- **Data Residency**: Strict EU GDPR & BaFin regulatory compliance
- **Data Volume**: 400 TB (growth at 15% YoY)
- **Current Platform**: Legacy Cloud Data Warehouse (Snowflake / Redshift)
- **Annual Current Spend**: $850,000 / year
- **Compliance**: GDPR, SOC2 Type II, immutable audit trails, dynamic data masking, fine-grained RBAC
- **Deployment Preference**: Customer EU AWS/Azure Cloud Account
- **Workloads**: Credit risk modeling, regulatory liquidity reporting, real-time fraud scoring
- **Expected Sizing & Output**:
  - Compute Sizing: ~280 vCPU (400 TB × 0.70 medium intensity)
  - Recommended Plan: IOMETE Enterprise on Customer Kubernetes
  - Sovereignty Score: **96 / 100** (Full VPC retention, customer-held KMS keys)
  - 3-Year Projected Savings: ~$870,000+ over 3 years
  - Payback Horizon: ~4 months

### Scenario 2: Helix Manufacturing
- **Industry**: Industrial Heavy Machinery & Automotive Supply
- **Region**: North America (Midwest USA)
- **Data Residency**: Moderate internal IP protection
- **Data Volume**: 120 TB
- **Current Platform**: Legacy Cloudera/Hadoop On-Premises cluster nearing end-of-life
- **Annual Current Spend**: $420,000 / year
- **Compliance**: ITAR-adjacent operational controls, ISO 27001
- **Deployment Preference**: Hybrid (Edge factory telemetry aggregated to private cloud)
- **Workloads**: IoT sensor ingestion, predictive maintenance, supply chain optimization
- **Expected Output**: Hybrid Kubernetes deployment; predictable vCPU licensing eliminating Hadoop licensing overhead.

### Scenario 3: Meridian Health
- **Industry**: Healthcare Provider & Clinical Research Network
- **Region**: United States (East Coast)
- **Data Residency**: Strict HIPAA & HITECH data safeguarding
- **Data Volume**: 260 TB
- **Current Platform**: Multi-cloud siloed warehouse (Google BigQuery + AWS Snowflake)
- **Annual Current Spend**: $1,100,000 / year
- **Compliance**: HIPAA BAA alignment, PHI access auditing, zero data egress outside healthcare boundary
- **Deployment Preference**: Private Cloud (AWS EKS in customer HIPAA-compliant account)
- **Workloads**: Clinical trial cohort analysis, patient billing analytics, genomic research
- **Expected Output**: Private Cloud deployment; high sovereignty score; explicitly flags any unverified HIPAA vendor BAA claims as `[ Requires IOMETE Validation ]`.

---

## 2. 3-Minute Hackathon Judge Script (Flawless Flow)
1. **0:00 – 0:30 (The Friction Hook & Dashboard)**:
   - *"Every sales rep and VP of Data faces the same wall: 'I love your tech, but how do I get the CFO and CISO to approve it?' This is Telemetry—the IOMETE Boardroom workspace."*
   - Show dashboard with active deal rooms, sovereignty scores, and 3-year TCO summaries.
2. **0:30 – 1:15 (Intake & Voice Extraction)**:
   - Click **"New Deal Room"**.
   - Tap **Microphone** and speak (or click *"Load Spoken Audio Transcript"*):
     > *"We are a European bank with around 400 terabytes of analytics data. We have strict EU data-residency requirements. Our current warehouse costs are rising, and we need strong audit controls, role-based access, and data masking. We want to keep data in our own cloud account."*
   - Watch ElevenLabs STT stream the transcript into the real-time editor.
   - Click **"Extract Structured Profile"**; observe the structured form fill with 400 TB, EU residency, and security needs.
3. **1:15 – 1:55 (Deterministic Business Case & Transparency)**:
   - Enter current spend: `$850,000`. Click **"Generate Business Case"**.
   - Instantly display the 3-column cockpit:
     - Recommended Deployment: **Customer Cloud Kubernetes (AWS EU)**.
     - Sovereignty Score: **96/100** with clear rationale.
     - 3-Year TCO: Side-by-side bar chart showing massive projected savings.
   - Point out the **Confidence & Sources drawer**: every number is tagged (`Calculated`, `Assumption`, `Vendor-claimed`).
   - Adjust one slider (e.g. increase data volume to 500 TB) and click **"Regenerate Case"** to show instant recalculation and version tracking (`v1 -> v2`).
4. **1:55 – 2:30 (Executive Memo & Print Export)**:
   - Switch to the **Executive Memo** tab.
   - Show the formal McKinsey-style approval document prepared for the CFO/CIO.
   - Click **"Print / Download Memo"** to show the print-ready CSS formatting.
5. **2:30 – 3:00 (The Spoken Board Briefing)**:
   - Click **"Play Executive Briefing"**.
   - The ElevenLabs audio player streams a confident, calm 60-second briefing summarizing NordBank's deployment fit, financial logic, and next steps.
   - Close: *"In under three minutes, a complex infrastructure decision becomes an approved deal."*
