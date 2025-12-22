export function ExamplePage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Página de exemplo</h2>
        <p className="text-muted-foreground">
          Esta é uma página de exemplo acessada pelo menu lateral.
        </p>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Card de Exemplo 1</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Conteúdo de demonstração para a página Item 1.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Card de Exemplo 2</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Mais conteúdo para ilustrar o layout.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">Card de Exemplo 3</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Adicione seus componentes aqui.
          </p>
        </div>
      </div>
    </div>
  )
}
