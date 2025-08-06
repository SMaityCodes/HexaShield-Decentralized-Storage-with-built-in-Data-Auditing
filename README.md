## 🔐 HexaShield – Decentralized-Storage-with-built-in-Data-Auditing

HexaShield is a secure and user-friendly platform for verifying the integrity of files stored on localized fog infrastructure, without relying on third-party auditors or full file access. Inspired by Filecoin, HexaShield enables peer-to-peer data auditing using probabilistic integrity checks and symmetric cryptography, making it ideal for non-technical users and resource-constrained edge devices.//below is the screenshot-

![Dashboard Screenshot](./assets/home.png)

---


## 🚀 Key Highlights

- **Cloud Component:** Stores files, generates cryptographic hashes (metadata), and coordinates integrity checks.
- **Fog Storage Auditing:** Local devices act as both storage nodes and auditors in a peer-to-peer setup.
- **Decentralized Verification:** File integrity is verified without needing the full file or a third-party.
- **Efficient & Lightweight:** Uses MAC-like cryptography and 4% random sampling (based on Ateniese’s model) for 99% detection of even 1% corruption.
- **Real-time Integrity Monitoring:** Ideal for applications needing timely and secure data validation.
- **User-Friendly GUI:** Simplified interface for file upload, audit triggers, and results view.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** – Responsive UI for uploads, audit triggers, and visual feedback.

### Backend
- **Node.js** – API handling, verification logic, and socket coordination.
- **Socket.IO** – Real-time communication between cloud and fog components.
- **MongoDB** – Metadata storage including cryptographic hashes and logs.

### Cryptography & Verification
- **Algebraic Signatures** – Metadata generation.
- **Zero-Knowledge Proofs** – Secure challenge-response without data exposure.
- **Diffie-Hellman Assumptions** – Protocol security foundation.
- **Random Sampling (Ateniese Model)** – Lightweight probabilistic auditing (4% sampling, 99% accuracy for 1% corruption).

---

## ✨ Features

### 🔒 Decentralized File Integrity Verification
- Peer-to-peer fog network where edge devices act as both storage and auditors.
- PDP-inspired probabilistic detection with high accuracy and low overhead.

### ⚡ Real-Time Challenge-Response Auditing
- Homomorphic authenticators & zero-knowledge proofs used.
- Alerts sent to cloud server on any unauthorized data modification.

### 📊 User-Friendly GUI Dashboard
- Intuitive React-based dashboard.
- Visual indicators for audit results.
- Designed for non-technical users.

---

## 🚀 How to Run on a Local Network

### 🖥️ System Setup – 3 Machines
- **Cloud PC** – Hosts the backend and database.
- **Alice (Auditor)** – Verifies integrity.
- **Bob (Auditee)** – Stores files.

### 🔁 Step 1: Clone the Repository (All PCs)
```bash
git clone https://github.com/yourusername/HexaShield.git
```

### 🌐 Step 2: Backend & Database Configuration
- Ensure all systems are on the same local Wi-Fi network.
- On **Alice** and **Bob**:
    - Start MongoDB.
    - Start backend server using **Cloud PC’s IP**.

#### Replace all `localhost` references with **Cloud IP** in:
- `.env`
- `Verification.tsx`
- `LocalHome.tsx`

### 📁 Step 3: Cloud PC Configuration
#### Edit `runScript.js`:
- Line 20: Path to `SetupTagGen.sh`
- Line 21 & 46: Path to `15MBData.csv`
- Line 71 & 102: Path to `Admin-Cloud` folder
- Line 47 & 103: Output path for Bob's file (`Bob.sh`)
- Line 72: Path to `Auditor` folder

#### Edit `SetupTagGen.sh`:
- Replace all `dataaudit` paths with your correct local path

### 📁 Step 4: Alice & Bob Configuration

#### Alice (Auditor):
- `runScript.js`: Update line 132 & 194 with your local file path
- `alice.sh`:
    - Set path to `dataaudit` folder
    - Set **Bob’s IP address**

#### Bob (Auditee):
- `runScript.js`: Update line 132 & 194 with your local file path
- `bob.sh`:
    - Set path to `dataaudit` folder
    - Set **Alice’s IP address**

### 🔐 Step 5: Network Permissions (All PCs)
```bash
chmod -R +x Demo/
sudo ufw allow 22224
sudo ufw allow 22223
```

### 🖥️ Step 6: Start Backend and Frontend (All PCs)
```bash
# Terminal 1
cd backend
npm install
npm start

# Terminal 2
cd frontend
npm install
npm run dev
```

### ✅ Step 7: Workflow Execution

1. **Register Users**
    - Cloud PC: Register as `cloud`
    - Alice & Bob: Register as `local`

2. **Cloud PC**
    - Upload a file and generate metadata
    - Send file to **Bob PC**
    - Distribute verification data to **Alice PC** and **Bob PC**
    - Click **Send Verification**

3. **Bob PC**
    - Run `bob.sh` to start process
    - Sends message to **Alice**

4. **Alice PC**
    - Run `alice.sh` to start auditing
    - Results auto-sent to Cloud and visible in dashboard

---

✅ **You’re All Set!**
You’ve successfully deployed HexaShield – a secure, decentralized, and real-time file integrity verification system across your local network.

---

📌 For more details, reach out or open an issue in the repository!
