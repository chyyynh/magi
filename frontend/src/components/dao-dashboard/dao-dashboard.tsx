"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/dao-dashboard/ui/card";
import { Badge } from "@/components/dao-dashboard/ui/badge";
import { DimensionChart } from "@/components/dao-dashboard/dimension-chart";
import {
  Activity,
  Users,
  Vote,
  TrendingUp,
  AlertTriangle,
  Database,
  DollarSign,
  FileText,
  ChevronRight,
  UserCheck,
  Award,
} from "lucide-react";

// DAO Proposals mapping
interface DAOProposal {
  id: string;
  title: string;
  url: string;
}

const daoProposals: Record<string, DAOProposal[]> = {
  morpho: [
    {
      id: "0x1b0ea13a62517fb9a7ee9cb770867d3d0d50529ed84b65c7e6f5fdd3ab728359",
      title: "Morpho Proposal #1",
      url: "/0x1b0ea13a62517fb9a7ee9cb770867d3d0d50529ed84b65c7e6f5fdd3ab728359",
    },
    {
      id: "0x5f6edc0f0a256995c17d7794d1e35505cd70f9c2312285aadc52c37195bf9106",
      title: "Morpho Proposal #2",
      url: "/0x5f6edc0f0a256995c17d7794d1e35505cd70f9c2312285aadc52c37195bf9106",
    },
    {
      id: "0x25b9a39372db49d7872e19ea2e354a30d2670748fcfff85caeaf84b0df99b5ab",
      title: "Morpho Proposal #3",
      url: "/0x25b9a39372db49d7872e19ea2e354a30d2670748fcfff85caeaf84b0df99b5ab",
    },
  ],
  uniswap: [],
  arbitrum: [],
  optimism: [],
  nouns: [],
};

const daoDatabase = {
  uniswap: {
    name: "Uniswap DAO",
    stage: 1,
    overallScore: 78,
    dimensions: {
      governance: {
        score: 82,
        votingRate: 42.5,
        nakamotoCoefficient: 28,
        giniCoefficient: 0.65,
        whaleConcentration: 18.5,
        status: "healthy",
      },
      treasury: {
        score: 75,
        size: 2.8e9,
        burnRate: 12.5,
        runway: 28,
        diversification: 62,
        status: "healthy",
      },
      decentralization: {
        score: 68,
        proposerConcentration: 35,
        automationLevel: 85,
        multisigConfig: "6-of-9",
        status: "moderate",
      },
      community: {
        score: 85,
        dau: 12500,
        wau: 45000,
        retention: 68,
        engagement: 72,
        status: "healthy",
      },
      efficiency: {
        score: 72,
        avgExecutionTime: 18,
        proposalThroughput: 14,
        successRate: 78,
        status: "healthy",
      },
      protocol: {
        score: 88,
        tvl: 4.2e9,
        revenue: 125000000,
        users: 850000,
        security: 95,
        status: "healthy",
      },
    },
    trends: [
      { date: "2024-01", score: 72 },
      { date: "2024-02", score: 74 },
      { date: "2024-03", score: 75 },
      { date: "2024-04", score: 76 },
      { date: "2024-05", score: 77 },
      { date: "2024-06", score: 78 },
    ],
    alerts: [
      {
        type: "warning",
        message: "Proposer concentration above 30% threshold",
        dimension: "decentralization",
      },
      {
        type: "info",
        message: "Treasury diversification improved by 8%",
        dimension: "treasury",
      },
    ],
  },
  arbitrum: {
    name: "Arbitrum DAO",
    stage: 1,
    overallScore: 72,
    dimensions: {
      governance: {
        score: 75,
        votingRate: 38.2,
        nakamotoCoefficient: 24,
        giniCoefficient: 0.68,
        whaleConcentration: 22.3,
        status: "healthy",
      },
      treasury: {
        score: 82,
        size: 3.5e9,
        burnRate: 8.2,
        runway: 42,
        diversification: 58,
        status: "healthy",
      },
      decentralization: {
        score: 65,
        proposerConcentration: 38,
        automationLevel: 78,
        multisigConfig: "9-of-12",
        status: "moderate",
      },
      community: {
        score: 78,
        dau: 18500,
        wau: 62000,
        retention: 72,
        engagement: 68,
        status: "healthy",
      },
      efficiency: {
        score: 68,
        avgExecutionTime: 22,
        proposalThroughput: 11,
        successRate: 72,
        status: "moderate",
      },
      protocol: {
        score: 85,
        tvl: 6.8e9,
        revenue: 98000000,
        users: 1200000,
        security: 92,
        status: "healthy",
      },
    },
    trends: [
      { date: "2024-01", score: 68 },
      { date: "2024-02", score: 69 },
      { date: "2024-03", score: 70 },
      { date: "2024-04", score: 71 },
      { date: "2024-05", score: 71 },
      { date: "2024-06", score: 72 },
    ],
    alerts: [
      {
        type: "warning",
        message: "Execution time trending upward",
        dimension: "efficiency",
      },
    ],
  },
  optimism: {
    name: "Optimism Collective",
    stage: 2,
    overallScore: 84,
    dimensions: {
      governance: {
        score: 88,
        votingRate: 52.8,
        nakamotoCoefficient: 35,
        giniCoefficient: 0.58,
        whaleConcentration: 14.2,
        status: "healthy",
      },
      treasury: {
        score: 78,
        size: 1.9e9,
        burnRate: 15.8,
        runway: 22,
        diversification: 72,
        status: "healthy",
      },
      decentralization: {
        score: 82,
        proposerConcentration: 28,
        automationLevel: 92,
        multisigConfig: "5-of-8",
        status: "healthy",
      },
      community: {
        score: 90,
        dau: 22000,
        wau: 78000,
        retention: 82,
        engagement: 85,
        status: "healthy",
      },
      efficiency: {
        score: 85,
        avgExecutionTime: 12,
        proposalThroughput: 18,
        successRate: 85,
        status: "healthy",
      },
      protocol: {
        score: 82,
        tvl: 2.1e9,
        revenue: 68000000,
        users: 680000,
        security: 94,
        status: "healthy",
      },
    },
    trends: [
      { date: "2024-01", score: 78 },
      { date: "2024-02", score: 80 },
      { date: "2024-03", score: 81 },
      { date: "2024-04", score: 82 },
      { date: "2024-05", score: 83 },
      { date: "2024-06", score: 84 },
    ],
    alerts: [
      {
        type: "info",
        message: "Highest community engagement this quarter",
        dimension: "community",
      },
    ],
  },
  nouns: {
    name: "Nouns DAO",
    stage: 1,
    overallScore: 76,
    dimensions: {
      governance: {
        score: 85,
        votingRate: 68.5,
        nakamotoCoefficient: 42,
        giniCoefficient: 0.52,
        whaleConcentration: 12.8,
        status: "healthy",
      },
      treasury: {
        score: 72,
        size: 0.85e9,
        burnRate: 18.5,
        runway: 18,
        diversification: 45,
        status: "moderate",
      },
      decentralization: {
        score: 78,
        proposerConcentration: 25,
        automationLevel: 88,
        multisigConfig: "4-of-7",
        status: "healthy",
      },
      community: {
        score: 82,
        dau: 8500,
        wau: 28000,
        retention: 78,
        engagement: 88,
        status: "healthy",
      },
      efficiency: {
        score: 68,
        avgExecutionTime: 24,
        proposalThroughput: 22,
        successRate: 68,
        status: "moderate",
      },
      protocol: {
        score: 72,
        tvl: 0.42e9,
        revenue: 28000000,
        users: 185000,
        security: 88,
        status: "healthy",
      },
    },
    trends: [
      { date: "2024-01", score: 74 },
      { date: "2024-02", score: 75 },
      { date: "2024-03", score: 75 },
      { date: "2024-04", score: 76 },
      { date: "2024-05", score: 76 },
      { date: "2024-06", score: 76 },
    ],
    alerts: [
      {
        type: "warning",
        message: "Treasury runway below 24 months",
        dimension: "treasury",
      },
      {
        type: "info",
        message: "Exceptional voting participation rate",
        dimension: "governance",
      },
    ],
  },
  morpho: {
    name: "Morpho DAO",
    stage: 0,
    overallScore: 65,
    dimensions: {
      governance: {
        score: 62,
        votingRate: 28.5,
        nakamotoCoefficient: 18,
        giniCoefficient: 0.72,
        whaleConcentration: 28.5,
        status: "moderate",
      },
      treasury: {
        score: 68,
        size: 0.45e9,
        burnRate: 22.5,
        runway: 14,
        diversification: 38,
        status: "moderate",
      },
      decentralization: {
        score: 58,
        proposerConcentration: 45,
        automationLevel: 68,
        multisigConfig: "3-of-5",
        status: "moderate",
      },
      community: {
        score: 72,
        dau: 5200,
        wau: 18500,
        retention: 62,
        engagement: 58,
        status: "moderate",
      },
      efficiency: {
        score: 65,
        avgExecutionTime: 28,
        proposalThroughput: 8,
        successRate: 72,
        status: "moderate",
      },
      protocol: {
        score: 78,
        tvl: 1.2e9,
        revenue: 42000000,
        users: 285000,
        security: 90,
        status: "healthy",
      },
    },
    trends: [
      { date: "2024-01", score: 58 },
      { date: "2024-02", score: 60 },
      { date: "2024-03", score: 62 },
      { date: "2024-04", score: 63 },
      { date: "2024-05", score: 64 },
      { date: "2024-06", score: 65 },
    ],
    alerts: [
      {
        type: "warning",
        message: "High proposer concentration - centralization risk",
        dimension: "decentralization",
      },
      {
        type: "warning",
        message: "Low voting participation rate",
        dimension: "governance",
      },
    ],
  },
};

export function DAODashboard() {
  const [selectedDAO, setSelectedDAO] = useState<string>("uniswap");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Initialize time on client side only
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const aggregateMetrics = {
    totalDAOs: Object.keys(daoDatabase).length,
    totalTVL: Object.values(daoDatabase).reduce(
      (sum, dao) => sum + dao.dimensions.protocol.tvl,
      0
    ),
    totalTreasury: Object.values(daoDatabase).reduce(
      (sum, dao) => sum + dao.dimensions.treasury.size,
      0
    ),
    avgScore: Math.round(
      Object.values(daoDatabase).reduce(
        (sum, dao) => sum + dao.overallScore,
        0
      ) / Object.keys(daoDatabase).length
    ),
    totalMembers: Object.values(daoDatabase).reduce(
      (sum, dao) => sum + dao.dimensions.protocol.users,
      0
    ),
    totalProposals: Object.values(daoDatabase).reduce(
      (sum, dao) => sum + dao.dimensions.efficiency.proposalThroughput,
      0
    ),
    mostActive: Object.entries(daoDatabase).reduce(
      (max, [key, dao]) =>
        dao.dimensions.community.engagement >
        daoDatabase[max as keyof typeof daoDatabase].dimensions.community
          .engagement
          ? key
          : max,
      "uniswap"
    ),
    criticalAlerts: Object.values(daoDatabase).reduce(
      (sum, dao) => sum + dao.alerts.filter((a) => a.type === "warning").length,
      0
    ),
  };

  const selectedDAOData = daoDatabase[selectedDAO as keyof typeof daoDatabase];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Tech background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated scan line */}
      <div className="pointer-events-none absolute inset-0 z-50">
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
      </div>

      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <header className="flex h-14 shrink-0 items-center justify-between border-b border-primary/10 bg-background/40 backdrop-blur-xl px-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              DAO Health Monitor
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {currentTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">
                {currentTime.toLocaleDateString()}
              </span>
              <span className="font-mono">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 ring-1 ring-success/20">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </div>
            <span className="text-sm font-medium text-success">Live</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        <aside className="flex w-2/7 shrink-0 flex-col gap-4 overflow-y-auto rounded-3xl border border-primary/10 bg-background/40 backdrop-blur-xl p-6 shadow-2xl shadow-primary/5 ring-1 ring-primary/5">
          {/* Overview section */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/70">
              Overview
            </h2>
            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm p-4 ring-1 ring-primary/5 shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total DAOs
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {aggregateMetrics.totalDAOs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg Score
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {aggregateMetrics.avgScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total TVL
                  </span>
                  <span className="text-lg font-bold text-accent">
                    ${(aggregateMetrics.totalTVL / 1e9).toFixed(1)}B
                  </span>
                </div>
              </div>
            </Card>
          </div>

        </aside>

        <main className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-primary/10 bg-background/40 backdrop-blur-xl shadow-2xl shadow-primary/5 ring-1 ring-primary/5">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Header with DAO name and score */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {selectedDAOData.name}
                </h2>

                {/* DAO Selector Tabs */}
                <div className="flex items-center gap-1 border-b border-border">
                  {Object.entries(daoDatabase).map(([key, dao]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDAO(key)}
                      className={`group relative flex items-center gap-2 px-4 py-2.5 transition-all duration-200 ${
                        selectedDAO === key
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {dao.name.split(" ")[0]}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          selectedDAO === key
                            ? "border-primary/40 text-primary"
                            : "border-border text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground"
                        }`}
                      >
                        {dao.overallScore}
                      </Badge>
                      {selectedDAO === key && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Stage {selectedDAOData.stage} •{" "}
                    {selectedDAOData.stage === 0
                      ? "Centralized"
                      : selectedDAOData.stage === 1
                      ? "Functional Decentralization"
                      : "Full Decentralization"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Overall Health
                </p>
                <p className="text-4xl font-bold text-primary">
                  {selectedDAOData.overallScore}
                </p>
              </div>
            </div>

            {/* Key metrics row */}
            <div className="mb-6 grid grid-cols-4 gap-4">
              <Card className="border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 ring-1 ring-primary/5 shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Voting Rate</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {selectedDAOData.dimensions.governance.votingRate}%
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-2 ring-1 ring-primary/20">
                    <Vote className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
              <Card className="border-accent/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 ring-1 ring-accent/5 shadow-lg hover:shadow-accent/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Treasury</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      $
                      {(selectedDAOData.dimensions.treasury.size / 1e9).toFixed(
                        1
                      )}
                      B
                    </p>
                  </div>
                  <div className="rounded-xl bg-accent/10 p-2 ring-1 ring-accent/20">
                    <DollarSign className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>
              <Card className="border-success/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 ring-1 ring-success/5 shadow-lg hover:shadow-success/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Members</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {(
                        selectedDAOData.dimensions.protocol.users / 1000
                      ).toFixed(0)}
                      K
                    </p>
                  </div>
                  <div className="rounded-xl bg-success/10 p-2 ring-1 ring-success/20">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                </div>
              </Card>
              <Card className="border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 ring-1 ring-primary/5 shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">TVL</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      $
                      {(selectedDAOData.dimensions.protocol.tvl / 1e9).toFixed(
                        1
                      )}
                      B
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-2 ring-1 ring-primary/20">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main visualization and metrics */}
            <div className="grid grid-cols-4 gap-6">
              {/* Recently Proposals - Left sidebar */}
              <div className="col-span-1">
                <Card className="border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 h-full ring-1 ring-primary/5 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Recent Proposals
                    </h3>
                    {daoProposals[selectedDAO] &&
                      daoProposals[selectedDAO].length > 0 && (
                        <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                          {daoProposals[selectedDAO].length}
                        </Badge>
                      )}
                  </div>
                  {daoProposals[selectedDAO] &&
                  daoProposals[selectedDAO].length > 0 ? (
                    <div className="space-y-2">
                      {daoProposals[selectedDAO].map((proposal) => (
                        <Link
                          key={proposal.id}
                          href={proposal.url}
                          className="block rounded-xl border border-primary/10 bg-card/30 p-3 hover:bg-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">
                                {proposal.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Click to analyze
                              </p>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/10 mb-3">
                        <FileText className="h-8 w-8 text-primary/40" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        No recent proposals
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Dimension Analysis - Takes up 2 columns */}
              <Card className="col-span-2 border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 relative ring-1 ring-primary/5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Dimension Analysis
                  </h3>
                  <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20 ring-1 ring-primary/5">
                    {selectedDimension
                      ? "Interactive Mode"
                      : "Click dimension to explore"}
                  </Badge>
                </div>

                {/* Dynamic Layout Container */}
                <div className="relative min-h-[400px]">
                  {/* Detail Panel - Positioned dynamically based on selected dimension */}
                  {selectedDimension && (
                    <div
                      className={`absolute z-10 transition-all duration-500 ease-out ${
                        // Position based on dimension angle
                        selectedDimension === "governance" // 0° - Top
                          ? "top-0 left-1/2 -translate-x-1/2 w-[90%]"
                          : selectedDimension === "treasury" // 60° - Top Right
                          ? "top-0 right-0 w-[45%]"
                          : selectedDimension === "decentralization" // 120° - Bottom Right
                          ? "bottom-0 right-0 w-[45%]"
                          : selectedDimension === "community" // 180° - Bottom
                          ? "bottom-0 left-1/2 -translate-x-1/2 w-[90%]"
                          : selectedDimension === "efficiency" // 240° - Bottom Left
                          ? "bottom-0 left-0 w-[45%]"
                          : selectedDimension === "protocol" // 300° - Top Left
                          ? "top-0 left-0 w-[45%]"
                          : ""
                      }`}
                      style={{
                        animation: "slideIn 0.5s ease-out",
                      }}
                    >
                      <div className="rounded-2xl bg-background/95 backdrop-blur-md border-2 border-primary/30 shadow-2xl shadow-primary/20 p-4 ring-1 ring-primary/10">
                        {selectedDimension === "governance" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-primary">
                                Governance Details
                              </h4>
                              <button
                                onClick={() => setSelectedDimension(null)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Voting Rate
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.governance
                                      .votingRate
                                  }
                                  %
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Nakamoto
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.governance
                                      .nakamotoCoefficient
                                  }
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Gini
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.governance
                                      .giniCoefficient
                                  }
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Whale Conc.
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.governance
                                      .whaleConcentration
                                  }
                                  %
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedDimension === "treasury" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-accent">
                                Treasury Details
                              </h4>
                              <button
                                onClick={() => setSelectedDimension(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Size
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  $
                                  {(
                                    selectedDAOData.dimensions.treasury.size /
                                    1e9
                                  ).toFixed(2)}
                                  B
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Burn Rate
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {selectedDAOData.dimensions.treasury.burnRate}
                                  %
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Runway
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {selectedDAOData.dimensions.treasury.runway}mo
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Diversification
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.treasury
                                      .diversification
                                  }
                                  %
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedDimension === "decentralization" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-primary">
                                Decentralization
                              </h4>
                              <button
                                onClick={() => setSelectedDimension(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Proposer Conc.
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.decentralization
                                      .proposerConcentration
                                  }
                                  %
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Automation
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.decentralization
                                      .automationLevel
                                  }
                                  %
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm col-span-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Multisig
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.decentralization
                                      .multisigConfig
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedDimension === "community" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-success">
                                Community Details
                              </h4>
                              <button
                                onClick={() => setSelectedDimension(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  DAU
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {selectedDAOData.dimensions.community.dau.toLocaleString()}
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  WAU
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {selectedDAOData.dimensions.community.wau.toLocaleString()}
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Retention
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.community
                                      .retention
                                  }
                                  %
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Engagement
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.community
                                      .engagement
                                  }
                                  %
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedDimension === "efficiency" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-warning">
                                Efficiency Details
                              </h4>
                              <button
                                onClick={() => setSelectedDimension(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Exec Time
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.efficiency
                                      .avgExecutionTime
                                  }
                                  d
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Throughput
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.efficiency
                                      .proposalThroughput
                                  }
                                  /mo
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm col-span-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Success Rate
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {
                                    selectedDAOData.dimensions.efficiency
                                      .successRate
                                  }
                                  %
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedDimension === "protocol" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-success">
                                Protocol Details
                              </h4>
                              <button
                                onClick={() => setSelectedDimension(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  TVL
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  $
                                  {(
                                    selectedDAOData.dimensions.protocol.tvl /
                                    1e9
                                  ).toFixed(2)}
                                  B
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Revenue
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  $
                                  {(
                                    selectedDAOData.dimensions.protocol
                                      .revenue / 1e6
                                  ).toFixed(1)}
                                  M
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Users
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {(
                                    selectedDAOData.dimensions.protocol.users /
                                    1000
                                  ).toFixed(0)}
                                  K
                                </p>
                              </div>
                              <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-primary/10 p-2 ring-1 ring-primary/5 shadow-sm">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Security
                                </p>
                                <p className="text-base font-bold text-foreground">
                                  {selectedDAOData.dimensions.protocol.security}
                                  %
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Radar Chart - Shifts and scales when dimension is selected */}
                  <div
                    className={`transition-all duration-500 ease-out ${
                      selectedDimension
                        ? selectedDimension === "governance" ||
                          selectedDimension === "protocol" ||
                          selectedDimension === "treasury"
                          ? "scale-75 translate-y-[80px]" // Top dimensions - shift down
                          : "scale-75 -translate-y-[80px]" // Bottom dimensions - shift up
                        : "scale-100"
                    } flex items-center justify-center`}
                    style={{ minHeight: "400px" }}
                  >
                    <DimensionChart
                      data={selectedDAOData.dimensions}
                      onDimensionClick={setSelectedDimension}
                      selectedDimension={selectedDimension}
                    />
                  </div>
                </div>
              </Card>

              {/* Voter Analysis - Right sidebar */}
              <div className="col-span-1">
                <Card className="border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 h-full ring-1 ring-primary/5 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Voter Analysis
                    </h3>
                    <div className="rounded-lg bg-primary/10 p-1.5 ring-1 ring-primary/20">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Top Voters */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Top Voters
                      </p>
                      <div className="space-y-2">
                        {[
                          { address: "0x1234...5678", power: "12.5%", votes: 24 },
                          { address: "0x8765...4321", power: "8.3%", votes: 18 },
                          { address: "0xabcd...ef12", power: "6.2%", votes: 15 },
                        ].map((voter, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl border border-primary/10 bg-card/30 p-2 ring-1 ring-primary/5 hover:bg-primary/5 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <Award
                                className={`h-3 w-3 ${
                                  idx === 0
                                    ? "text-warning"
                                    : idx === 1
                                    ? "text-muted-foreground"
                                    : "text-muted-foreground/60"
                                }`}
                              />
                              <span className="text-xs font-mono text-foreground">
                                {voter.address}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-primary">
                                {voter.power}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {voter.votes} votes
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Voter Stats */}
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Participation Stats
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Active Voters
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {(selectedDAOData.dimensions.governance.nakamotoCoefficient * 10).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Avg Vote Power
                          </span>
                          <span className="text-sm font-bold text-primary">
                            {(100 / selectedDAOData.dimensions.governance.nakamotoCoefficient).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Voter Diversity
                          </span>
                          <span className="text-sm font-bold text-success">
                            {(100 - selectedDAOData.dimensions.governance.giniCoefficient * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Patterns */}
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Recent Activity
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                          <span className="text-muted-foreground">
                            High engagement last 7 days
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">
                            {selectedDAOData.dimensions.governance.votingRate}% participation rate
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Alerts section */}
            {selectedDAOData.alerts.length > 0 && (
              <Card className="mt-6 border-primary/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 ring-1 ring-primary/5 shadow-lg">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Active Alerts
                </h3>
                <div className="space-y-2">
                  {selectedDAOData.alerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-xl border p-3 ring-1 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                        alert.type === "warning"
                          ? "border-warning/20 bg-warning/5 ring-warning/10 hover:shadow-warning/10"
                          : "border-primary/20 bg-primary/5 ring-primary/10 hover:shadow-primary/10"
                      }`}
                    >
                      <div className={`rounded-lg p-1.5 ${
                        alert.type === "warning"
                          ? "bg-warning/10 ring-1 ring-warning/20"
                          : "bg-primary/10 ring-1 ring-primary/20"
                      }`}>
                        {alert.type === "warning" ? (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                        ) : (
                          <Activity className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {alert.message}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground capitalize">
                          {alert.dimension}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
