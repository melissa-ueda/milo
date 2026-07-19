"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Home,
  PackageOpen,
  Plus,
  ReceiptText,
  Settings2,
} from "lucide-react";
import type { Household } from "@/src/domain/entities/household";
import type { ParsedReceipt, ReviewLine } from "@/src/domain/entities/receipt";
import { emojiForType } from "@/src/domain/taxonomy/emoji";
import type { StapleId } from "@/src/domain/values/staple-id";
import { DetailModal } from "./components/DetailModal";
import { MobileNav } from "./components/MobileNav";
import { PurchaseDetailModal } from "./components/PurchaseDetailModal";
import { ReviewSheet } from "./components/ReviewSheet";
import { UploadModal } from "./components/UploadModal";
import { formatLongDate, formatWeekday } from "./labels/format";
import { useStore, useStoreState } from "./store/store-context";
import { nextShopLikelihood } from "@/src/domain/forecast/shopping-window";
import {
  recommendationView,
  type RecommendationView,
} from "./view-models/recommendation-vm";
import { purchaseView, type PurchaseView } from "./view-models/history-vm";
import { HomeView } from "./views/HomeView";
import { HistoryView } from "./views/HistoryView";
import { HouseholdView } from "./views/HouseholdView";
import { OnboardingView, type OnboardingStep } from "./views/OnboardingView";
import { PantryView } from "./views/PantryView";
import {
  ShoppingListView,
  type ShoppingItemView,
} from "./views/ShoppingListView";

type Tab = "home" | "inventory" | "history" | "household";

export function App() {
  const store = useStore();
  const loaded = useStoreState((s) => s.loaded);
  const settings = useStoreState((s) => s.settings);
  const forecasts = useStoreState((s) => s.forecasts);
  const history = useStoreState((s) => s.history);
  const manualEntries = useStoreState((s) => s.manualEntries);

  const [tab, setTab] = useState<Tab>("home");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState("");
  const [reviewReceipt, setReviewReceipt] = useState<ParsedReceipt | null>(
    null,
  );
  const [reviewItems, setReviewItems] = useState<ReviewLine[]>([]);
  const [reviewImageBlob, setReviewImageBlob] = useState<Blob | null>(null);
  const [savingReceipt, setSavingReceipt] = useState(false);
  const [detail, setDetail] = useState<RecommendationView | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseView | null>(
    null,
  );
  const [toast, setToast] = useState("");
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  // Onboarding + form drafts, seeded from persisted settings once loaded.
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>("welcome");
  const [householdDraft, setHouseholdDraft] = useState<Household>(
    settings.household,
  );
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    void store.init();
  }, [store]);

  // Seed the editable household draft from persisted settings once they load.
  useEffect(() => {
    if (loaded && !draftReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time seed of editable draft from async-loaded settings
      setHouseholdDraft(settings.household);
      setDraftReady(true);
    }
  }, [loaded, draftReady, settings.household]);

  const now = new Date();
  const items = useMemo(
    () => forecasts.map((f) => recommendationView(f, new Date())),
    [forecasts],
  );
  const purchases = useMemo(() => history.map(purchaseView), [history]);
  const nextShop = useMemo(() => {
    const likelihood = nextShopLikelihood(
      settings.household,
      forecasts,
      new Date(),
    );
    return {
      likely: likelihood.likely,
      confidence: likelihood.confidence,
      day: formatWeekday(likelihood.nextShop),
    };
  }, [forecasts, settings.household]);

  const selectedItems = items.filter((i) => i.selected);
  const shoppingListItems: ShoppingItemView[] = [
    ...selectedItems.map((i) => ({
      name: i.name,
      emoji: i.emoji,
      subtitle: `1 · likely out ${i.due}`,
    })),
    ...manualEntries.map((e) => ({
      name: e.name,
      emoji: emojiForType(e.type),
      subtitle: "1 · Added by you",
    })),
  ];
  const selectedCount = selectedItems.length + manualEntries.length;

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const nav = (target: Tab) => {
    setTab(target);
    setShoppingListOpen(false);
  };
  const openUpload = () => {
    setReceiptError("");
    setUploadOpen(true);
  };

  const handleFileSelected = async (file: File) => {
    if (!settings.geminiApiKey) {
      setReceiptError(
        "Please configure your Gemini API Key first (under Household settings or in onboarding).",
      );
      return;
    }
    setIsProcessingReceipt(true);
    setReceiptError("");
    try {
      const { receipt, imageBlob } = await store.parseReceipt(file);
      setReviewReceipt(receipt);
      setReviewItems(
        receipt.lines.map((line, index) => ({
          ...line,
          id: `${index}-${line.normalizedName}`,
        })),
      );
      setReviewImageBlob(imageBlob);
      setUploadOpen(false);
    } catch (error) {
      setReceiptError(
        error instanceof Error ? error.message : "Failed to parse receipt",
      );
    } finally {
      setIsProcessingReceipt(false);
    }
  };

  const handleSaveReceipt = async () => {
    if (!reviewReceipt || !reviewImageBlob) return;
    setSavingReceipt(true);
    setReceiptError("");
    try {
      // Complete onboarding first so its initial empty refresh does not run
      // again after saving the receipt and learning from its lines.
      if (!settings.onboarded) {
        await store.completeOnboarding(householdDraft);
      }
      await store.saveReceipt({
        store: reviewReceipt.store,
        purchaseDate: reviewReceipt.purchaseDate,
        image: reviewImageBlob,
        lines: reviewItems,
      });
      setReviewReceipt(null);
      setReviewItems([]);
      setReviewImageBlob(null);
      notify(
        `${reviewItems.length} items added to your household intelligence.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save receipt";
      setReceiptError(message);
      notify(message);
    } finally {
      setSavingReceipt(false);
    }
  };

  // Blank shell while the store loads, so we never flash the main app before
  // deciding between onboarding and the tabs.
  if (!loaded) {
    return <Shell />;
  }

  if (!settings.onboarded) {
    return (
      <Shell>
        <OnboardingView
          step={onboardingStep}
          household={householdDraft}
          onGetStarted={() => setOnboardingStep("profile")}
          onChange={(field, value) =>
            setHouseholdDraft((h) => ({ ...h, [field]: value }))
          }
          onProfileComplete={() => setOnboardingStep("first-item")}
          onComplete={(firstItem) =>
            void store.completeOnboarding(householdDraft, firstItem)
          }
          onReceiptSelected={(file) => void handleFileSelected(file)}
          isProcessingReceipt={isProcessingReceipt}
          receiptError={receiptError}
          geminiApiKey={settings.geminiApiKey}
          setGeminiApiKey={(key) => void store.saveApiKey(key)}
        />
        {reviewReceipt && (
          <ReviewSheet
            receipt={reviewReceipt}
            items={reviewItems}
            onItemsChange={setReviewItems}
            onSave={handleSaveReceipt}
            onClose={() => {
              setReviewReceipt(null);
              setReviewItems([]);
              setReviewImageBlob(null);
              setReceiptError("");
            }}
            saving={savingReceipt}
            error={receiptError}
          />
        )}
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="sticky top-0 z-20 border-b border-[#e5e9df] bg-[#f7f8f4]/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 relative">
          <button
            id="logo-btn"
            onClick={() => nav("home")}
            className="flex items-center gap-2.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1d5b45] text-lg text-white">
              m
            </span>
            <span className="text-lg font-semibold tracking-tight">milo</span>
          </button>
          <span className="rounded-full p-2 text-[#c2ccc4]" aria-hidden>
            <Bell size={19} />
          </span>
        </div>
      </header>

      <div className="mx-auto block px-4 py-6">
        <section className="min-w-0 pb-20">
          {shoppingListOpen ? (
            <ShoppingListView
              items={shoppingListItems}
              onClose={() => setShoppingListOpen(false)}
              onAddItem={(name) => store.addManualEntry(name)}
            />
          ) : (
            <>
              {tab === "home" && (
                <HomeView
                  householdName={settings.household.name}
                  todayLabel={formatLongDate(now)}
                  selectedCount={selectedCount}
                  items={items}
                  nextShop={nextShop}
                  onToggle={(item) =>
                    item.stapleId && void store.toggle(item.stapleId)
                  }
                  onDetail={setDetail}
                  onUpload={openUpload}
                  onList={() => setShoppingListOpen(true)}
                />
              )}
              {tab === "inventory" && (
                <PantryView
                  items={items}
                  onDetail={setDetail}
                  onUpload={openUpload}
                />
              )}
              {tab === "history" && (
                <HistoryView
                  purchases={purchases}
                  onUpload={openUpload}
                  onPurchaseClick={setSelectedPurchase}
                  onDeletePurchase={async (id) => {
                    await store.deleteReceipt(id);
                    setSelectedPurchase(null);
                    notify("Receipt removed from your shopping history.");
                  }}
                />
              )}
              {tab === "household" && (
                <HouseholdView
                  household={householdDraft}
                  onChange={(field, value) =>
                    setHouseholdDraft((h) => ({ ...h, [field]: value }))
                  }
                  onSave={() => {
                    void store.saveHousehold(householdDraft);
                    notify(
                      "Household settings saved. Milo will use these for future predictions.",
                    );
                  }}
                  geminiApiKey={settings.geminiApiKey}
                  setGeminiApiKey={(key) => void store.saveApiKey(key)}
                />
              )}
            </>
          )}
        </section>
      </div>

      <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 justify-around border-t border-[#e5e9df] bg-white px-5 py-2">
        <MobileNav
          id="m-nav-home"
          icon={<Home size={19} />}
          label="Home"
          active={tab === "home"}
          onClick={() => nav("home")}
        />
        <MobileNav
          id="m-nav-pantry"
          icon={<PackageOpen size={19} />}
          label="Pantry"
          active={tab === "inventory"}
          onClick={() => nav("inventory")}
        />
        <button
          id="m-add-receipt"
          onClick={openUpload}
          className="-mt-6 grid h-13 w-13 place-items-center rounded-full bg-[#1d5b45] text-white shadow-lg"
        >
          <Plus size={23} />
        </button>
        <MobileNav
          id="m-nav-history"
          icon={<ReceiptText size={19} />}
          label="History"
          active={tab === "history"}
          onClick={() => nav("history")}
        />
        <MobileNav
          id="m-nav-household"
          icon={<Settings2 size={19} />}
          label="Household"
          active={tab === "household"}
          onClick={() => nav("household")}
        />
      </nav>

      {uploadOpen && (
        <UploadModal
          isProcessing={isProcessingReceipt}
          error={receiptError}
          onClose={() => {
            setUploadOpen(false);
            setReceiptError("");
          }}
          onFileSelected={handleFileSelected}
          onAddManualItem={(name) => {
            void store.addManualStaple(name);
            setUploadOpen(false);
            notify(`Manually added ${name} to pantry.`);
          }}
        />
      )}
      {reviewReceipt && (
        <ReviewSheet
          receipt={reviewReceipt}
          items={reviewItems}
          onItemsChange={setReviewItems}
          onSave={handleSaveReceipt}
          onClose={() => {
            setReviewReceipt(null);
            setReviewItems([]);
            setReviewImageBlob(null);
            setReceiptError("");
          }}
          saving={savingReceipt}
          error={receiptError}
        />
      )}
      {detail && (
        <DetailModal
          item={detail}
          onClose={() => setDetail(null)}
          onRemove={async () => {
            if (detail.stapleId)
              await store.recordFeedback(detail.stapleId as StapleId, "ignore");
            setDetail(null);
            notify(`Milo will learn from removing ${detail.name}.`);
          }}
          onStillHave={async () => {
            if (detail.stapleId)
              await store.recordFeedback(
                detail.stapleId as StapleId,
                "still_have",
              );
            setDetail(null);
            notify(`Thanks — Milo learned that you still have ${detail.name}.`);
          }}
          onRanOut={async () => {
            if (detail.stapleId)
              await store.recordFeedback(
                detail.stapleId as StapleId,
                "ran_out",
              );
            setDetail(null);
            notify(`Thanks — Milo learned that ${detail.name} ran out.`);
          }}
        />
      )}
      {selectedPurchase && (
        <PurchaseDetailModal
          purchase={selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
        />
      )}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#17261f] px-5 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <main className="mobile-shell relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#f7f8f4] text-[#17261f] shadow-[0_0_45px_rgba(28,54,39,0.12)]">
      {children}
    </main>
  );
}
