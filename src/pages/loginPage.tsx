import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    // 'min-h-svh' asegura que ocupe toda la pantalla real en móviles y escritorio
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      
      {/* SECCIÓN IZQUIERDA: Formulario centrado */}
      <div className="flex flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {/* SECCIÓN DERECHA: Imagen (solo visible en pantallas grandes) */}
      <div className="relative hidden lg:block bg-muted">
        <img
          src="/login-background.jpg" 
          alt="Login Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay para dar contraste si la imagen es muy clara */}
        <div className="absolute inset-0 bg-slate-900/5" />
      </div>
    </div>
  );
}
/* 'grid-cols-1' por defecto (móvil), 'lg:grid-cols-2' en escritorio */
