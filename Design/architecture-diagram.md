# Post-Quantum Cryptography Suite - Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[React UI - App.tsx]
        DASH[Dashboard]
        TABS[Tab Navigation System]
    end

    subgraph "Core Modules"
        ENC[Encryption Panel]
        FILE[File Encryption]
        KEY[Key Management]
        CERT[Certificate Manager]
        NET[Network Security]
        SIM[Quantum Simulator]
        VIZ[Security Visualization]
        THREAT[Quantum Threat Meter]
        ACT[Activity Log]
    end

    subgraph "Algorithm Selection Layer"
        ALG[Algorithm Selector]
        KYBER[CRYSTALS-Kyber KEM]
        DIL[CRYSTALS-Dilithium Signatures]
        SPHINCS[SPHINCS+ Signatures]
        NTRU[NTRU KEM]
        SABER[SABER KEM]
        FRODO[FrodoKEM]
    end

    subgraph "Cryptographic Service Layer"
        CRYPTO[CryptoService]
        KEYGEN[Key Generation]
        ENCRYPT[Encryption/Encapsulation]
        DECRYPT[Decryption/Decapsulation]
        SIGN[Digital Signing]
        VERIFY[Signature Verification]
    end

    subgraph "External Libraries"
        MLKEM[mlkem Library]
        NOBLE[Noble Post-Quantum]
        HASH[Noble Hashes]
    end

    subgraph "UI Component Library"
        RADIX[Radix UI Primitives]
        MOTION[Framer Motion]
        CHARTS[Recharts]
        THREE[Three.js/Fiber]
    end

    subgraph "State Management"
        STATE[React State Hooks]
        STATS[Statistics Tracking]
        ACTIVITY[Activity Tracking]
    end

    UI --> DASH
    UI --> TABS
    TABS --> ENC
    TABS --> FILE
    TABS --> KEY
    TABS --> CERT
    TABS --> NET
    TABS --> SIM
    TABS --> VIZ
    TABS --> THREAT
    TABS --> ACT

    ENC --> ALG
    FILE --> ALG
    KEY --> ALG
    CERT --> ALG

    ALG --> KYBER
    ALG --> DIL
    ALG --> SPHINCS
    ALG --> NTRU
    ALG --> SABER
    ALG --> FRODO

    KYBER --> CRYPTO
    DIL --> CRYPTO
    SPHINCS --> CRYPTO
    NTRU --> CRYPTO
    SABER --> CRYPTO
    FRODO --> CRYPTO

    CRYPTO --> KEYGEN
    CRYPTO --> ENCRYPT
    CRYPTO --> DECRYPT
    CRYPTO --> SIGN
    CRYPTO --> VERIFY

    KEYGEN --> MLKEM
    KEYGEN --> NOBLE
    ENCRYPT --> MLKEM
    ENCRYPT --> HASH
    DECRYPT --> MLKEM
    DECRYPT --> HASH
    SIGN --> NOBLE
    VERIFY --> NOBLE

    UI --> RADIX
    VIZ --> CHARTS
    SIM --> THREE
    UI --> MOTION

    ENC --> STATE
    FILE --> STATE
    KEY --> STATE
    STATE --> STATS
    STATE --> ACTIVITY
    STATS --> DASH
    ACTIVITY --> ACT
```

## Detailed Workflow Diagram

```mermaid
flowchart TD
    START([User Access Application]) --> LOAD[Load React Application]
    LOAD --> INIT[Initialize State & Components]
    
    INIT --> CHOOSE{Choose Operation}
    
    CHOOSE -->|Encrypt/Sign| FLOW1[Text/File Encryption Flow]
    CHOOSE -->|Manage Keys| FLOW2[Key Management Flow]
    CHOOSE -->|Certificates| FLOW3[Certificate Management Flow]
    CHOOSE -->|Network| FLOW4[Network Security Flow]
    CHOOSE -->|Analysis| FLOW5[Threat Analysis Flow]
    
    FLOW1 --> SELECT1[Select PQC Algorithm]
    SELECT1 --> GEN1{Keys Generated?}
    GEN1 -->|No| KEYGEN1[Generate Key Pair]
    GEN1 -->|Yes| INPUT1[Input Data/File]
    KEYGEN1 --> INPUT1
    
    INPUT1 --> TYPE1{Algorithm Type?}
    TYPE1 -->|KEM| ENC1[Encapsulate & Encrypt]
    TYPE1 -->|Signature| SIGN1[Generate Digital Signature]
    
    ENC1 --> OUTPUT1[Display Ciphertext]
    SIGN1 --> OUTPUT1
    
    OUTPUT1 --> VERIFY1{Verify/Decrypt?}
    VERIFY1 -->|Yes| PROCESS1[Process Verification]
    PROCESS1 --> RESULT1[Display Result]
    
    RESULT1 --> LOG1[Update Activity Log]
    LOG1 --> STATS1[Update Dashboard Stats]
    
    FLOW2 --> KEYMGMT[Key Management Interface]
    KEYMGMT --> KEYOPS{Key Operation}
    KEYOPS -->|Generate| GENKEY[Generate New Key Pair]
    KEYOPS -->|Export| EXPORT[Export Keys]
    KEYOPS -->|Import| IMPORT[Import Keys]
    GENKEY --> STORE[Store in State]
    EXPORT --> DOWNLOAD[Download Key Files]
    IMPORT --> VALIDATE[Validate & Load Keys]
    
    FLOW3 --> CERTMGMT[Certificate Manager]
    CERTMGMT --> CERTOPS{Certificate Operation}
    CERTOPS -->|Create CSR| CSR[Generate Certificate Request]
    CERTOPS -->|Sign| SIGNCERT[Sign Certificate]
    CERTOPS -->|Verify| VERIFYCERT[Verify Certificate]
    CSR --> CERTSTORE[Store Certificate Data]
    
    FLOW4 --> NETSCAN[Network Security Scanner]
    NETSCAN --> SCANOPS{Operation}
    SCANOPS -->|Scan| DOSCAN[Scan Network Nodes]
    SCANOPS -->|Upgrade| UPGRADE[Upgrade to PQC]
    DOSCAN --> ASSESS[Assess Threat Levels]
    ASSESS --> DISPLAY[Display Network Status]
    UPGRADE --> UPDATENODE[Update Node Encryption]
    
    FLOW5 --> THREAT[Threat Analysis]
    THREAT --> ANALYZE[Analyze Quantum Threats]
    ANALYZE --> SIMULATE[Run Simulations]
    SIMULATE --> VISUALIZE[Visualize Results]
    VISUALIZE --> RECOMMEND[Generate Recommendations]
    
    STATS1 --> END([Continue Using Application])
    STORE --> END
    DOWNLOAD --> END
    VALIDATE --> END
    CERTSTORE --> END
    DISPLAY --> END
    UPDATENODE --> END
    RECOMMEND --> END
```

## Component Interaction Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant AlgoSelector
    participant CryptoService
    participant PQCLibrary
    participant StateManager
    participant Dashboard

    User->>UI: Select Algorithm
    UI->>AlgoSelector: Update Selection
    AlgoSelector->>StateManager: Set Algorithm
    
    User->>UI: Generate Keys
    UI->>CryptoService: generateKeyPair(algorithm)
    CryptoService->>PQCLibrary: Call Algorithm Library
    PQCLibrary-->>CryptoService: Return KeyPair
    CryptoService-->>UI: KeyPair Generated
    UI->>StateManager: Store Keys
    StateManager->>Dashboard: Update Stats
    
    User->>UI: Input Data
    UI->>UI: Store Input
    
    User->>UI: Click Encrypt/Sign
    UI->>CryptoService: encrypt/sign(data, keys, algorithm)
    CryptoService->>PQCLibrary: Perform Crypto Operation
    PQCLibrary-->>CryptoService: Return Result
    CryptoService-->>UI: Operation Complete
    UI->>StateManager: Log Activity
    StateManager->>Dashboard: Update Metrics
    UI->>User: Display Output
    
    User->>UI: Verify/Decrypt
    UI->>CryptoService: verify/decrypt(data, keys, algorithm)
    CryptoService->>PQCLibrary: Verify Operation
    PQCLibrary-->>CryptoService: Validation Result
    CryptoService-->>UI: Result
    UI->>StateManager: Log Activity
    UI->>User: Display Verification Result
```

## Data Flow Architecture

```mermaid
graph LR
    subgraph "Input Sources"
        TEXT[Text Input]
        FILES[File Upload]
        KEYS[Key Import]
    end

    subgraph "Processing Pipeline"
        VALIDATE[Input Validation]
        ALGO[Algorithm Selection]
        CRYPTO[Cryptographic Processing]
        FORMAT[Output Formatting]
    end

    subgraph "Storage Layer"
        MEMSTATE[React State]
        SESSSTORE[Session Storage]
        LOCSTORE[Local Storage]
    end

    subgraph "Output Destinations"
        DISPLAY[UI Display]
        EXPORT[File Download]
        CLIPBOARD[Clipboard]
        LOG[Activity Log]
    end

    TEXT --> VALIDATE
    FILES --> VALIDATE
    KEYS --> VALIDATE
    
    VALIDATE --> ALGO
    ALGO --> CRYPTO
    CRYPTO --> FORMAT
    
    FORMAT --> MEMSTATE
    MEMSTATE --> DISPLAY
    MEMSTATE --> EXPORT
    MEMSTATE --> CLIPBOARD
    MEMSTATE --> LOG
    
    KEYS --> LOCSTORE
    MEMSTATE --> SESSSTORE
```

## Technology Stack Breakdown

```mermaid
graph TB
    subgraph "Frontend Framework"
        REACT[React 18]
        VITE[Vite Build Tool]
        TS[TypeScript]
    end

    subgraph "UI/UX Layer"
        TAILWIND[Tailwind CSS]
        RADIXUI[Radix UI Components]
        LUCIDE[Lucide Icons]
        FRAMER[Framer Motion]
    end

    subgraph "Cryptography Libraries"
        MLKEMLIB[mlkem - ML-KEM Implementation]
        NOBLELIB[Noble Post-Quantum Crypto]
        HASHLIB[Noble Hashes - SHA/HKDF]
    end

    subgraph "Visualization"
        RECHARTS[Recharts - Analytics]
        THREEJS[Three.js - 3D Graphics]
        R3F[React Three Fiber]
    end

    subgraph "Build & Deploy"
        NPM[NPM Package Manager]
        POSTCSS[PostCSS]
        BUILD[Production Build]
    end

    REACT --> VITE
    VITE --> BUILD
    REACT --> TAILWIND
    REACT --> RADIXUI
    REACT --> FRAMER
    
    REACT --> MLKEMLIB
    REACT --> NOBLELIB
    NOBLELIB --> HASHLIB
    
    REACT --> RECHARTS
    REACT --> THREEJS
    THREEJS --> R3F
    
    NPM --> VITE
    TAILWIND --> POSTCSS
```

---

## Key Features by Module

### 1. Encryption Panel
- Text encryption/decryption
- Digital signature generation
- Signature verification with detailed results
- Support for all PQC algorithms

### 2. File Encryption
- Drag & drop file upload
- Bulk file processing
- File download after encryption
- Progress tracking

### 3. Key Management
- Key pair generation for all algorithms
- Key export (Public/Private/Both)
- Key import and validation
- Key visualization

### 4. Certificate Manager
- CSR generation
- Certificate signing
- Certificate verification
- Certificate export

### 5. Network Security
- Network node scanning
- Threat level assessment
- PQC migration recommendations
- Real-time status monitoring

### 6. Quantum Simulator
- Attack simulation
- Algorithm comparison
- Performance benchmarking

### 7. Security Visualization
- Real-time analytics
- Algorithm performance charts
- Threat trend analysis

### 8. Quantum Threat Meter
- Risk assessment
- Timeline predictions
- Migration urgency indicators

### 9. Activity Log
- Comprehensive audit trail
- Operation timestamps
- Success/failure tracking
- Algorithm usage statistics

---

**Legend:**
- Rectangles: Components/Modules
- Diamonds: Decision Points
- Arrows: Data/Control Flow
- Subgraphs: Logical Groupings
