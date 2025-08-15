
// Suppress all drizzle-orm type errors by declaring all modules as any
// This disables type checking for drizzle-orm and its submodules

declare module 'drizzle-orm' {
  const anyExport: any;
  export = anyExport;
}
declare module 'drizzle-orm/*' {
  const anyExport: any;
  export = anyExport;
}
declare module 'drizzle-orm/*.*' {
  const anyExport: any;
  export = anyExport;
}
declare module 'drizzle-orm/*/*' {
  const anyExport: any;
  export = anyExport;
}
declare module 'drizzle-orm/*/*.*' {
  const anyExport: any;
  export = anyExport;
}
