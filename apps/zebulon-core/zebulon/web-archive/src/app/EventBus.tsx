import { createContext, useContext, useMemo, useRef } from "react";

type Event = { tile: string; text: string; at: string; status?: "ok" | "warn" | "error" };
type Bus = {
  emit: (e: Event) => void;
  useFeed: () => Event[];
  subscribe: (fn: (e: Event) => void) => () => void;
};

const Ctx = createContext<Bus | null>(null);

export function EventBusProvider({ children }: { children: React.ReactNode }) {
  const feedRef = useRef<Event[]>([]);
  const subs = useRef(new Set<(e: Event) => void>());

  const api = useMemo<Bus>(() => ({
    emit(e) {
      feedRef.current = [e, ...feedRef.current].slice(0, 20);
      subs.current.forEach(fn => fn(e));
    },
    useFeed() {
      return feedRef.current;
    },
    subscribe(fn) {
      subs.current.add(fn);
      return () => subs.current.delete(fn);
    }
  }), []);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useEventBus() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("EventBus not found");
  return ctx;
}
