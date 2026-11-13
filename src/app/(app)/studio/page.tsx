"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioChatConsole, AttachedFile } from "@/components/studio/StudioChatConsole";
import { StudioCardPanel } from "@/components/studio/StudioCardPanel";
import { StudioSaveModal } from "@/components/studio/StudioSaveModal";
import { StudioSettingsModal } from "@/components/studio/StudioSettingsModal";
import { StudioPassphraseModal } from "@/components/studio/StudioPassphraseModal";
import { ChronoCardPayloadV1, MessageTurn } from "@/lib/card/schema";
import { ModelProviderConfig, PROVIDER_PRESETS } from "@/lib/ai/provider";
import { convertImageToPngBase64 } from "@/lib/card/image-utils";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { ToastProvider } from "@/components/ui/Toast";

export default function StudioPage() {
  return (
    <ToastProvider>
      <StudioPageContent />
    </ToastProvider>
  );
}

function StudioPageContent() {
  const [mountedCard, setMountedCard] = useState<ChronoCardPayloadV1 | null>(null);
  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(null);
  const [customCoverBase64, setCustomCoverBase64] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("OCTOBOT");
  const [cardTitle, setCardTitle] = useState("My Memory Card");
  const [isRightPanelOpenMobile, setIsRightPanelOpenMobile] = useState(false);

  // File Attachments for Prompt (PDF, DOCX, Images, Text)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Global Drag overlay state
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);

  // Modals
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPassphraseOpen, setIsPassphraseOpen] = useState(false);
  const [pendingEncryptedFile, setPendingEncryptedFile] = useState<File | null>(null);
  const [passphraseError, setPassphraseError] = useState<string | null>(null);

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  // Cloud AI Settings (NVIDIA NIM / OpenRouter / Custom)
  const [providerConfig, setProviderConfig] = useState<ModelProviderConfig>({
    provider: "nvidia",
    apiKey: "",
    model: PROVIDER_PRESETS.nvidia.defaultModel,
    baseUrl: PROVIDER_PRESETS.nvidia.baseUrl,
  });

  // ─── Vercel AI SDK useChat Integration with Multi-Step Agent Tool Loop ───
  const {
    messages,
    input,
    handleSubmit: submitChat,
    append,
    setInput,
    stop,
    status,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      providerConfig,
      agent: { id: "octobot", name: agentName || "OCTOBOT" },
      memory: mountedCard ? mountedCard.state : undefined,
    },
    maxSteps: 5,
    onError: (err) => {
      console.error("Vercel AI SDK Agent error:", err);
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Laser / Fiber-Optic Connecting Wire State between Bottom Chat Dock and Right Memory Card Dock
  const [wireCoords, setWireCoords] = useState<{
    from: { x: number; y: number };
    to: { x: number; y: number };
  } | null>(null);

  const wireRef = useRef<{
    chatPort: HTMLElement | null;
    cardPort: HTMLElement | null;
    rafId: number;
    resizeObserver: ResizeObserver | null;
  }>({
    chatPort: null,
    cardPort: null,
    rafId: 0,
    resizeObserver: null,
  });

  const updateWire = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) {
      setWireCoords(null);
      return;
    }

    const chatPort = wireRef.current.chatPort || document.getElementById("studio-chat-port");
    const cardPort = wireRef.current.cardPort || document.getElementById("studio-card-port");

    if (!chatPort || !cardPort) {
      setWireCoords(null);
      return;
    }

    // Cache refs
    wireRef.current.chatPort = chatPort;
    wireRef.current.cardPort = cardPort;

    const chatRect = chatPort.getBoundingClientRect();
    const cardRect = cardPort.getBoundingClientRect();

    if (cardRect.width === 0 || cardRect.height === 0) {
      setWireCoords(null);
      return;
    }

    setWireCoords({
      from: {
        x: chatRect.left + chatRect.width / 2,
        y: chatRect.top + chatRect.height / 2,
      },
      to: {
        x: cardRect.left + cardRect.width / 2,
        y: cardRect.top + cardRect.height / 2,
      },
    });
  }, []);

  // Smooth 60fps wire updates using rAF + ResizeObserver
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const chatPort = document.getElementById("studio-chat-port");
    const cardPort = document.getElementById("studio-card-port");
    if (!chatPort || !cardPort) return;

    wireRef.current.chatPort = chatPort;
    wireRef.current.cardPort = cardPort;

    // Initial update
    updateWire();

    // ResizeObserver for layout changes
    const resizeObserver = new ResizeObserver(() => {
      updateWire();
    });
    resizeObserver.observe(chatPort);
    resizeObserver.observe(cardPort);
    wireRef.current.resizeObserver = resizeObserver;

    // rAF loop for scroll-driven updates
    const animate = () => {
      updateWire();
      wireRef.current.rafId = requestAnimationFrame(animate);
    };
    wireRef.current.rafId = requestAnimationFrame(animate);

    // Window resize fallback
    window.addEventListener("resize", updateWire);

    return () => {
      cancelAnimationFrame(wireRef.current.rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWire);
    };
  }, [updateWire]);

  // Load saved settings & chat session from localStorage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("chronocard_provider_config");
      if (savedConfig) {
        setProviderConfig(JSON.parse(savedConfig));
      }
      const savedSession = sessionStorage.getItem("chronocard_active_chat");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, [setMessages]);

  // Sync active chat into sessionStorage for refresh recovery
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem("chronocard_active_chat", JSON.stringify(messages));
      }
    } catch {
      // Ignore
    }
  }, [messages]);

  const handleSaveConfig = (newConfig: ModelProviderConfig) => {
    setProviderConfig(newConfig);
    try {
      localStorage.setItem("chronocard_provider_config", JSON.parse(JSON.stringify(newConfig)));
    } catch {
      // Ignore
    }
  };

  // Recent cards for empty state carousel
  const [recentCards, setRecentCards] = useState<Array<{
    title: string;
    coverUrl: string;
    turnCount: number;
    timestamp: number;
    cardId: string;
  }>>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chronocard_recent_cards");
      if (saved) {
        setRecentCards(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const addRecentCard = useCallback((card: { title: string; coverUrl: string; turnCount: number; timestamp: number; cardId: string }) => {
    setRecentCards((prev) => {
      const filtered = prev.filter((c) => c.cardId !== card.cardId);
      const updated = [card, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("chronocard_recent_cards", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Update recent cards when a card is mounted
  useEffect(() => {
    if (mountedCard && customCoverUrl) {
      addRecentCard({
        title: mountedCard.metadata.cardTitle,
        coverUrl: customCoverUrl,
        turnCount: mountedCard.metadata.turnCount,
        timestamp: Date.now(),
        cardId: mountedCard.cardId,
      });
    }
  }, [mountedCard, customCoverUrl, addRecentCard]);

  const messageTurns: MessageTurn[] = useMemo(() => {
    return messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      timestamp: (m as any).createdAt instanceof Date
        ? (m as any).createdAt.getTime()
        : (m as any).createdAt
        ? new Date((m as any).createdAt).getTime()
        : (m as any).timestamp || Date.now(),
      toolInvocations: (m as any).toolInvocations,
      attachments: (m as any).attachments,
      experimental_attachments: (m as any).experimental_attachments,
    }));
  }, [messages]);

  // Handle attaching files to the chat prompt (Images, PDFs, Word docs, Text)
  const handleAttachFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const fileId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const isImg = file.type.startsWith("image/");
      const fileType = file.type || (isImg ? "image/png" : "application/octet-stream");

      if (isImg) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string;
          setAttachedFiles((prev) => [
            ...prev,
            {
              id: fileId,
              file,
              name: file.name,
              size: file.size,
              type: "image",
              contentType: fileType,
              previewUrl,
              status: "ready",
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        // Document: PDF, DOCX, TXT, JSON, MD, CSV, Code
        setAttachedFiles((prev) => [
          ...prev,
          {
            id: fileId,
            file,
            name: file.name,
            size: file.size,
            type: "document",
            contentType: fileType,
            status: "parsing",
          },
        ]);

        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/parse-document", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.error || "Failed to parse document content");
          }

          setAttachedFiles((prev) =>
            prev.map((item) =>
              item.id === fileId
                ? {
                    ...item,
                    extractedText: data.text,
                    pageCount: data.pageCount,
                    status: "ready",
                  }
                : item
            )
          );
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Document parse failed";
          setAttachedFiles((prev) =>
            prev.map((item) =>
              item.id === fileId
                ? {
                    ...item,
                    status: "error",
                    errorMessage: msg,
                  }
                : item
            )
          );
        }
      }
    }
  };

  const handleRemoveAttachedFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Handles ANY image dropped or picked for artwork / memory cartridge
  const handleImageFile = async (file: File) => {
    // 1. Check if it's an existing ChronoCard PNG
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/card/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 401 && data.requiresPassphrase) {
        setPendingEncryptedFile(file);
        setPassphraseError(null);
        setIsPassphraseOpen(true);
        return;
      }

      if (res.ok && data.success && data.payload) {
        // Rehydrate memory card!
        setMountedCard(data.payload);
        setCardTitle(data.payload.metadata.cardTitle || "Rehydrated Memory");
        setAgentName(data.payload.metadata.agentName || "OCTOBOT");
        if (data.payload.state.recentMessages?.length) {
          setMessages(
            data.payload.state.recentMessages.map((m: any) => ({
              id: m.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              role: m.role,
              content: m.content,
              createdAt: m.timestamp ? new Date(m.timestamp) : new Date(),
              toolInvocations: m.toolInvocations,
              attachments: m.attachments,
              experimental_attachments: m.experimental_attachments,
            }))
          );
        }
        setCustomCoverUrl(URL.createObjectURL(file));
        const base64 = await convertImageToPngBase64(file);
        setCustomCoverBase64(base64);
        setIsRightPanelOpenMobile(true);
        return;
      }
    } catch {
      // Proceed to treat as fresh custom image
    }

    // 2. Treat as fresh custom image cover
    try {
      const base64 = await convertImageToPngBase64(file);
      setCustomCoverBase64(base64);
      setCustomCoverUrl(URL.createObjectURL(file));
      setCardTitle(file.name.replace(/\.[^/.]+$/, ""));
      setIsRightPanelOpenMobile(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load image";
      alert(`Could not load image: ${msg}`);
    }
  };

  const handlePassphraseSubmit = async (passphrase: string) => {
    if (!pendingEncryptedFile) return;

    const formData = new FormData();
    formData.append("file", pendingEncryptedFile);
    formData.append("passphrase", passphrase);

    try {
      const res = await fetch("/api/card/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPassphraseError(data.error || "Authentication failed. Incorrect password.");
        return;
      }

      setIsPassphraseOpen(false);
      const file = pendingEncryptedFile;
      setPendingEncryptedFile(null);
      setMountedCard(data.payload);
      setCardTitle(data.payload.metadata.cardTitle || "Rehydrated Memory");
      setAgentName(data.payload.metadata.agentName || "OCTOBOT");
      if (data.payload.state.recentMessages?.length) {
        setMessages(
          data.payload.state.recentMessages.map((m: any) => ({
            id: m.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            role: m.role,
            content: m.content,
            createdAt: m.timestamp ? new Date(m.timestamp) : new Date(),
            toolInvocations: m.toolInvocations,
            attachments: m.attachments,
            experimental_attachments: m.experimental_attachments,
          }))
        );
      }
      setCustomCoverUrl(URL.createObjectURL(file));
      const base64 = await convertImageToPngBase64(file);
      setCustomCoverBase64(base64);
      setIsRightPanelOpenMobile(true);
    } catch {
      setPassphraseError("Connection error while attempting to unlock card.");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setMountedCard(null);
    setCustomCoverUrl(null);
    setCustomCoverBase64(null);
    setAttachedFiles([]);
    try {
      sessionStorage.removeItem("chronocard_active_chat");
    } catch {
      // Ignore
    }
  };

  const handleEjectCard = () => {
    setCustomCoverUrl(null);
    setCustomCoverBase64(null);
    setMountedCard(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) return;

    const hasParsing = attachedFiles.some((f) => f.status === "parsing");
    if (hasParsing) {
      alert("Please wait a moment while your document finishes reading.");
      return;
    }

    const trimmedInput = input.trim();
    if (!trimmedInput && attachedFiles.length === 0) return;

    // Filter image attachments for multimodal vision
    const imageAttachments = attachedFiles
      .filter((f) => f.type === "image" && f.previewUrl)
      .map((f) => ({
        name: f.name,
        contentType: f.contentType,
        url: f.previewUrl!,
      }));

    // Format extracted document contexts
    const docContexts = attachedFiles
      .filter((f) => f.type === "document" && f.extractedText)
      .map(
        (f) =>
          `[ATTACHED DOCUMENT: ${f.name}${f.pageCount ? ` (${f.pageCount} pages)` : ""}]\n--- DOCUMENT CONTENT START ---\n${f.extractedText}\n--- DOCUMENT CONTENT END ---`
      )
      .join("\n\n");

    let promptText = trimmedInput;
    if (docContexts) {
      promptText = trimmedInput
        ? `${docContexts}\n\n[USER INQUIRY]\n${trimmedInput}`
        : `${docContexts}\n\n[USER INQUIRY]\nPlease analyze this document, summarize its core themes, and extract vital takeaways.`;
    } else if (!trimmedInput && imageAttachments.length > 0) {
      promptText = "Please inspect and analyze this attached image in detail.";
    }

    const currentAttachments = attachedFiles.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      contentType: f.contentType,
      url: f.previewUrl,
      pageCount: f.pageCount,
    }));

    // Reset input & attachments
    setInput("");
    setAttachedFiles([]);

    await append(
      {
        role: "user",
        content: promptText,
        experimental_attachments: imageAttachments.length > 0 ? imageAttachments : undefined,
        attachments: currentAttachments,
      } as any,
      {
        body: {
          providerConfig,
          agent: { id: "octobot", name: agentName || "OCTOBOT" },
          memory: mountedCard ? mountedCard.state : undefined,
        },
      }
    );
  };

  const handleStopStreaming = () => {
    stop();
  };

// Keyboard shortcuts & Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteQuery, setCommandPaletteQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        setCommandPaletteQuery("");
      }
      // Escape: Close modals, stop streaming, close command palette
      if (e.key === "Escape") {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else if (isStreaming) {
          handleStopStreaming();
        } else if (isSaveOpen) {
          setIsSaveOpen(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (isPassphraseOpen) {
          setIsPassphraseOpen(false);
        } else if (isRightPanelOpenMobile) {
          setIsRightPanelOpenMobile(false);
        }
      }
      // Cmd/Ctrl + Enter: Send message (when not in textarea)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isStreaming) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== "TEXTAREA" && activeElement?.tagName !== "INPUT") {
          e.preventDefault();
          const form = document.getElementById("studio-chat-dock") as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStreaming, isSaveOpen, isSettingsOpen, isPassphraseOpen, isRightPanelOpenMobile, isCommandPaletteOpen, handleStopStreaming]);
  


  // Global Drag listeners
  const handleGlobalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGlobal(true);
  };

  const handleGlobalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsDraggingGlobal(false);
    }
  };

  const handleGlobalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGlobal(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const firstFile = files[0];
      const ext = firstFile.name.split(".").pop()?.toLowerCase();
      // If it's a document (PDF, Word doc, etc.), attach to prompt automatically!
      if (
        [
          "pdf",
          "docx",
          "txt",
          "md",
          "csv",
          "json",
          "js",
          "ts",
          "tsx",
          "jsx",
          "py",
        ].includes(ext || "")
      ) {
        handleAttachFiles(files);
      } else {
        // If image, can be treated as cover / card import
        handleImageFile(firstFile);
      }
    }
  };

  return (
    <div
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
      className="h-screen w-screen flex flex-col bg-[#000000] text-[#EDEDF0] selection:bg-[#FF5500] selection:text-white font-matrix antialiased overflow-hidden select-none"
    >
      {/* Hidden File Picker for Cartridge Artwork */}
      <input
        ref={hiddenFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
        }}
      />

      {/* CAD Blueprint Grid Overlay (Pure Black, Zero Navy Blue) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px] z-0"
        aria-hidden="true"
      />

      {/* Full-Screen Drag and Drop Overlay */}
      {isDraggingGlobal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#FF5500] animate-in fade-in duration-150">
          <div className="relative p-8 bg-[#080808] border border-white/[0.14] flex flex-col items-center justify-center shadow-[0_24px_80px_rgba(0,0,0,0.95)] max-w-lg w-full">
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <UploadCloud className="w-14 h-14 text-[#FF5500] animate-bounce mb-4" />
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-2 tracking-wider">
              MOUNT CARTRIDGE OR ATTACH DOCS
            </h2>
            <p className="text-neutral-400 text-xs font-mono leading-relaxed">
              Drop any standard PNG or ChronoCard to mount memory, or drop PDFs / Word Docs to attach to your chat.
            </p>
          </div>
        </div>
      )}

      {/* Studio Top Navigation Bar */}
      <StudioNavbar
        mountedCardTitle={mountedCard?.metadata.cardTitle || (customCoverUrl ? cardTitle : undefined)}
        hasCustomCover={!!customCoverUrl}
        isChatActive={messages.length > 0}
        showRightPanel={isRightPanelOpenMobile}
        onToggleRightPanel={() => setIsRightPanelOpenMobile((prev) => !prev)}
        onNewChat={handleNewChat}
        onOpenSaveModal={() => setIsSaveOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onUploadClick={() => hiddenFileInputRef.current?.click()}
      />

      {/* ─── Main Workspace Body: Expansive Chat (Left) + Dedicated Image Dock (Right) ─── */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* ─── LEFT / MAIN AREA: Expansive Chat Interface with Generative UI ─── */}
        <main
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            isRightPanelOpenMobile ? "hidden lg:flex" : "flex"
          }`}
        >
          <StudioChatConsole
            messages={messages}
            input={input}
            attachedFiles={attachedFiles}
            isStreaming={isStreaming}
            agentName={agentName}
            cardTitle={cardTitle}
            customCoverUrl={customCoverUrl}
            worldState={mountedCard?.state.worldState}
            coreFacts={mountedCard?.state.coreFacts}
            providerName={providerConfig.provider}
            modelName={providerConfig.model}
            onInputChange={setInput}
            onAttachFiles={handleAttachFiles}
            onRemoveAttachedFile={handleRemoveAttachedFile}
            onSubmit={handleSubmit}
            onStopStreaming={handleStopStreaming}
            onUploadImageClick={() => hiddenFileInputRef.current?.click()}
            onOpenSaveModal={() => setIsSaveOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onClearChat={handleNewChat}
            onQuickPrompt={(prompt) => {
              setInput(prompt);
            }}
            recentCards={recentCards}
            onMountRecentCard={(card) => {
              // Mount the card by loading its image and setting up state
              setCustomCoverUrl(card.coverUrl);
              setCardTitle(card.title);
              // The actual card loading would happen via handleImageFile
              // For now, we just set the UI state
              setIsRightPanelOpenMobile(true);
            }}
          />
        </main>

        {/* ─── RIGHT AREA: Dedicated Uploaded Image & Cartridge Showcase Panel ─── */}
        <div
          className={`${
            isRightPanelOpenMobile ? "flex w-full" : "hidden"
          } lg:flex lg:w-auto h-full shrink-0`}
        >
          <StudioCardPanel
            customCoverUrl={customCoverUrl}
            cardTitle={cardTitle}
            onCardTitleChange={setCardTitle}
            agentName={agentName}
            onAgentNameChange={setAgentName}
            messagesCount={messages.length}
            worldState={mountedCard?.state.worldState}
            coreFacts={mountedCard?.state.coreFacts}
            onUploadClick={() => hiddenFileInputRef.current?.click()}
            onOpenSaveModal={() => setIsSaveOpen(true)}
            onEjectCard={handleEjectCard}
            onFileDrop={handleImageFile}
            onClose={() => setIsRightPanelOpenMobile(false)}
            isMounted={!!mountedCard}
            mountedCardTitle={mountedCard?.metadata.cardTitle}
            mountedTurnCount={mountedCard?.metadata.turnCount || 0}
            onScrollToChatTop={() => {
              const chatArea = document.querySelector('[data-chat-scroll-area]');
              if (chatArea) {
                chatArea.scrollTop = 0;
              }
            }}
            onCopyPayloadSize={() => {
              const kb = Math.max(messages.length * 1.6, 0.4).toFixed(1);
              navigator.clipboard.writeText(`~${kb} KB`);
            }}
            onShowCipherDetails={() => {
              alert("Cipher: AES-256-GCM\nKDF: scrypt (N=32768, r=8, p=1)\nIV: 12 bytes random\nAuth Tag: 16 bytes\nChunk: PNG tEXt (chronocard_state)");
            }}
          />
        </div>
      </div>

      {/* ─── Cyber-Physical Glowing Fiber-Optic Connecting Wire (Chat Input Dock -> Cartridge Port) ─── */}
      {wireCoords && (
        <svg
          className="fixed inset-0 pointer-events-none z-20 w-screen h-screen hidden lg:block overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <filter id="studio-wire-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g>
            {/* Outer Glow Path */}
            <path
              d={`M ${wireCoords.from.x} ${wireCoords.from.y} C ${
                wireCoords.from.x + (wireCoords.to.x - wireCoords.from.x) * 0.52
              } ${wireCoords.from.y}, ${
                wireCoords.from.x + (wireCoords.to.x - wireCoords.from.x) * 0.48
              } ${wireCoords.to.y}, ${wireCoords.to.x} ${wireCoords.to.y}`}
              fill="none"
              stroke="#FF5500"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.85"
              filter="url(#studio-wire-glow)"
            />

            {/* Inner Light Beam with continuous flowing pulse */}
            <path
              d={`M ${wireCoords.from.x} ${wireCoords.from.y} C ${
                wireCoords.from.x + (wireCoords.to.x - wireCoords.from.x) * 0.52
              } ${wireCoords.from.y}, ${
                wireCoords.from.x + (wireCoords.to.x - wireCoords.from.x) * 0.48
              } ${wireCoords.to.y}, ${wireCoords.to.x} ${wireCoords.to.y}`}
              fill="none"
              stroke="#FFF2CC"
              strokeWidth="1.2"
              strokeDasharray="6 6"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-24"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>

            {/* Target Reticle at Cartridge Port */}
            <circle cx={wireCoords.to.x} cy={wireCoords.to.y} r="3" fill="#FF5500" />
            <circle
              cx={wireCoords.to.x}
              cy={wireCoords.to.y}
              r="8"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            >
              <animate attributeName="r" values="5;13;5" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Origin Node at Chat Output Port */}
            <circle cx={wireCoords.from.x} cy={wireCoords.from.y} r="3" fill="#FF5500" />
          </g>
        </svg>
      )}

      {/* ─── Modals ─── */}
      <StudioSaveModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        messages={messageTurns}
        worldState={mountedCard?.state.worldState}
        coreFacts={mountedCard?.state.coreFacts}
        initialAgentName={agentName}
        initialCardTitle={cardTitle}
        customCoverBase64={customCoverBase64}
        customCoverUrl={customCoverUrl}
      />

      <StudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={providerConfig}
        onSaveConfig={handleSaveConfig}
      />

      <StudioPassphraseModal
        isOpen={isPassphraseOpen}
        onClose={() => setIsPassphraseOpen(false)}
        onSubmit={handlePassphraseSubmit}
        error={passphraseError}
      />

      {/* ─── Command Palette ─── */}
      {isCommandPaletteOpen && (
        <CommandPalette
          query={commandPaletteQuery}
          onQueryChange={setCommandPaletteQuery}
          onClose={() => setIsCommandPaletteOpen(false)}
          messages={messages}
          onSearchMessages={(q) => {
            // Scroll to first matching message
            const messageElements = document.querySelectorAll('[data-message-content]');
            for (const el of messageElements) {
              if (el.textContent?.toLowerCase().includes(q.toLowerCase())) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                (el as HTMLElement).style.outline = "2px solid #FF5500";
                setTimeout(() => { (el as HTMLElement).style.outline = "none"; }, 2000);
                break;
              }
            }
          }}
          onExportConversation={() => {
            // Export as JSON
            const data = {
              title: cardTitle,
              agent: agentName,
              exportedAt: new Date().toISOString(),
              turns: messages.length,
              messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
                timestamp: (m as any).createdAt || (m as any).timestamp,
              })),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ChronoCard_${cardTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}_conversation.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          onExportMarkdown={() => {
            // Export as Markdown
            const md = `# ${cardTitle}\n\n**Agent:** ${agentName}  \n**Exported:** ${new Date().toLocaleString()}  \n**Turns:** ${messages.length}\n\n---\n\n` +
              messages.map((m) => `## ${m.role === "user" ? "Operator" : (agentName || "OCTOBOT")}\n\n${m.content}\n`).join("\n---\n\n");
            const blob = new Blob([md], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ChronoCard_${cardTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}_conversation.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          onCopyAll={() => {
            const text = messages.map((m) => `[${m.role.toUpperCase()}] ${m.content}`).join("\n\n");
            navigator.clipboard.writeText(text);
          }}
          onClearChat={handleNewChat}
          onOpenSettings={() => { setIsSettingsOpen(true); setIsCommandPaletteOpen(false); }}
          onOpenSaveModal={() => { setIsSaveOpen(true); setIsCommandPaletteOpen(false); }}
          mountedCard={mountedCard}
          isStreaming={isStreaming}
          onStopStreaming={handleStopStreaming}
        />
      )}
    </div>
  );
}

function CommandPalette({
  query,
  onQueryChange,
  onClose,
  messages,
  onSearchMessages,
  onExportConversation,
  onExportMarkdown,
  onCopyAll,
  onClearChat,
  onOpenSettings,
  onOpenSaveModal,
  mountedCard,
  isStreaming,
  onStopStreaming,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  messages: any[];
  onSearchMessages: (q: string) => void;
  onExportConversation: () => void;
  onExportMarkdown: () => void;
  onCopyAll: () => void;
  onClearChat: () => void;
  onOpenSettings: () => void;
  onOpenSaveModal: () => void;
  mountedCard: any;
  isStreaming: boolean;
  onStopStreaming: () => void;
}) {
  const commands = [
    { id: "search", label: "Search Messages", description: "Find text in conversation", icon: "🔍", action: () => onSearchMessages(query) },
    { id: "export-json", label: "Export as JSON", description: "Download full conversation data", icon: "📦", action: onExportConversation },
    { id: "export-md", label: "Export as Markdown", description: "Download readable .md file", icon: "📝", action: onExportMarkdown },
    { id: "copy-all", label: "Copy All Text", description: "Copy entire conversation to clipboard", icon: "📋", action: onCopyAll },
    { id: "clear", label: "Clear Chat", description: "Start fresh conversation", icon: "🗑️", action: onClearChat, danger: true },
    { id: "settings", label: "Open Settings", description: "Configure AI provider & model", icon: "⚙️", action: onOpenSettings },
    { id: "save", label: "Bake & Download Card", description: "Export current memory as PNG", icon: "💾", action: onOpenSaveModal, primary: true },
  ].filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 pointer-events-none" onClick={onClose}>
      <div className="pointer-events-auto w-full max-w-2xl bg-[#080808] border border-white/[0.12] shadow-[0_24px_80px_rgba(0,0,0,0.98)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Top Specular Line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="p-4 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">⌘K</span>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Type a command or search messages..."
              className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#FF5500] px-10 py-3 text-white placeholder-neutral-600 focus:outline-none font-matrix text-sm pr-10"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
                if (e.key === "Enter" && commands[0]) {
                  commands[0].action();
                  onClose();
                }
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-mono">Esc to close</span>
          </div>

          {/* Command List */}
          <div className="max-h-80 overflow-y-auto space-y-1">
            {commands.length > 0 ? (
              commands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => { cmd.action(); onClose(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded ${cmd.primary ? "bg-[#FF5500]/10 hover:bg-[#FF5500]/20 text-white" : cmd.danger ? "hover:bg-red-950/30 hover:text-red-400 text-neutral-300" : "hover:bg-white/5 text-neutral-300"}`}
                >
                  <span className="text-2xl">{cmd.icon}</span>
                  <div className="flex-1">
                    <div className="font-matrix text-sm font-medium">{cmd.label}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{cmd.description}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-neutral-500 text-sm font-matrix">
                No commands match "{query}"
              </div>
            )}
          </div>

          {/* Context Hint */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span>⌘K Command Palette &nbsp;•&nbsp; ↵ Enter Send &nbsp;•&nbsp; Esc Close</span>
            {isStreaming && <span className="text-[#FF5500] animate-pulse">● Streaming</span>}
            {mountedCard && <span className="text-[#34D399]">● Card Mounted</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


