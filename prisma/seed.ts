import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.report.deleteMany();
  await prisma.threat.deleteMany();
  await prisma.logFile.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      fullName: "Alex Morgan",
      email: "analyst@logsage.ai",
      passwordHash: "$2b$10$mockHashForPhaseOneSeedDataOnly"
    }
  });

  const logFile = await prisma.logFile.create({
    data: {
      userId: user.id,
      filename: "auth-gateway.log",
      fileType: ".log",
      rawContent: [
        "Jun 18 09:38:11 auth-gateway sshd[2184]: Failed password for root from 203.0.113.42 port 48214 ssh2",
        "Jun 18 09:44:22 auth-gateway sshd[2190]: Failed password for deploy from 203.0.113.42 port 48222 ssh2",
        "Jun 18 09:51:03 auth-gateway sshd[2201]: Accepted password for backup from 203.0.113.42 port 48248 ssh2"
      ].join("\\n")
    }
  });

  await prisma.threat.createMany({
    data: [
      {
        userId: user.id,
        logFileId: logFile.id,
        threatType: "Credential Attack",
        severity: "critical",
        sourceIp: "203.0.113.42",
        description: "Repeated SSH failures followed by a suspicious successful login.",
        aiExplanation:
          "This pattern is consistent with brute-force activity against an exposed SSH service. The successful login after repeated failures raises the likelihood of credential compromise.",
        evidence: "52 failed SSH login attempts for root, deploy, and backup users within 8 minutes.",
        score: 96,
        confidence: 0.94
      },
      {
        userId: user.id,
        logFileId: logFile.id,
        threatType: "Privilege Abuse",
        severity: "high",
        sourceIp: "10.0.4.18",
        description: "Unexpected privileged command activity after a new shell session.",
        aiExplanation:
          "The sequence resembles post-compromise discovery followed by privilege escalation. Validate the account owner and inspect process lineage.",
        evidence: "Unexpected sudo invocation occurred 46 seconds after a new shell session.",
        score: 88,
        confidence: 0.88
      }
    ]
  });

  await prisma.report.create({
    data: {
      userId: user.id,
      logFileId: logFile.id,
      title: "Authentication Anomaly Incident",
      summary:
        "LogSage AI identified a coordinated brute-force pattern against auth-gateway.log involving repeated SSH failures and a suspicious successful login.",
      recommendations: [
        "Block 203.0.113.42 at the edge firewall.",
        "Review successful SSH sessions on auth-gateway.",
        "Rotate credentials for targeted accounts.",
        "Enable stronger SSH controls such as MFA or key-only access."
      ]
    }
  });

  console.log("Seeded LogSage AI Phase 1 mock data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
