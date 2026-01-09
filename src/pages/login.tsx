import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      
      {/* COLUMNA IZQUIERDA: Formulario */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {/* COLUMNA DERECHA: Imagen (Solo visible en Desktop) */}
      <div className="relative hidden lg:block bg-slate-100">
        <img
          src="/login-background.jpg" 
          alt="Login Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/10" />
      </div>
    </div>
  );
}