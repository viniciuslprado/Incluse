export default function SkipLinks() {
  return (
    <>
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-6 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-b-md focus:text-sm focus:font-medium focus:no-underline"
      >
        Pular para conteúdo principal
      </a>
      <a 
        href="#navigation" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-48 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-b-md focus:text-sm focus:font-medium focus:no-underline"
      >
        Pular para navegação
      </a>
      <a 
        href="#accessibility-menu" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:right-6 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-b-md focus:text-sm focus:font-medium focus:no-underline"
      >
        Menu de acessibilidade
      </a>
    </>
  );
}