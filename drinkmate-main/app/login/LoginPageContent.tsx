"use client";

// Login page with enhanced UI and font configuration
// Last updated: September 1, 2025
// Added multilingual support with Cairo/Montserrat fonts

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/contexts/auth-context";
import { useTranslation } from "@/lib/contexts/translation-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "sonner";
import { getAppImageUrl } from "@/lib/utils/app-images";

export default function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info" | "">("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const { isRTL, t } = useTranslation();
  
  // Safely get search params
  useEffect(() => {
    if (searchParams) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        setRedirectPath(redirect);
        console.log('Redirect path set to:', redirect);
      }

      const message = searchParams.get('message');
      if (message) {
        setStatusMessage(decodeURIComponent(message));
        setMessageType("success");
        toast.success(decodeURIComponent(message), {
          duration: 5000,
          icon: <CheckCircle2 className="h-5 w-5" />
        });
      }
      
      const error = searchParams.get('error');
      if (error) {
        setErrorMessage(decodeURIComponent(error));
        setMessageType("error");
        toast.error(decodeURIComponent(error), {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
      
      const session = searchParams.get('session');
      if (session === 'expired') {
        setErrorMessage("Your session has expired. Please sign in again.");
        setMessageType("info");
        toast.info("Your session has expired. Please sign in again.", {
          duration: 5000,
          icon: <Info className="h-5 w-5" />
        });
      }
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login component - isAuthenticated:', isAuthenticated, 'redirectPath:', redirectPath);
    if (isAuthenticated) {
      console.log('Redirecting to:', redirectPath);
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors
    setStatusMessage("");
    setMessageType("");

    if (!email || !password) {
      const msg = isRTL ? "يرجى ملء جميع الحقول" : "Please fill in all fields";
      setErrorMessage(msg);
      setMessageType("error");
      toast.error(msg, {
        duration: 5000,
        icon: <AlertCircle className="h-5 w-5" />
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Login attempt starting...');
      const result = await login(email, password, rememberMe);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, setting up redirect...');
        // Store remember me preference if checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        
        const successMsg = isRTL ? "تم تسجيل الدخول بنجاح! جارٍ التحويل..." : "Login successful! Redirecting...";
        setStatusMessage(successMsg);
        setMessageType("success");
        toast.success(successMsg, {
          duration: 3000,
          icon: <CheckCircle2 className="h-5 w-5" />
        });
        // Immediate redirect instead of timeout
        console.log('Immediate redirect to:', redirectPath);
        router.push(redirectPath);
      } else {
        setErrorMessage(result.message || (isRTL ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password"));
        setMessageType("error");
        toast.error(result.message, {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    } catch (err: any) {
      const errorMsg = err.message || (isRTL ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
      setErrorMessage(errorMsg);
      setMessageType("error");
      toast.error(errorMsg, {
        duration: 5000,
        icon: <AlertCircle className="h-5 w-5" />
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <Suspense fallback={null}>
      <PageLayout currentPage="login">
        <div className="container max-w-md mx-auto py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
          <Card className={`border-[#12d6fa]/20 shadow-lg ${isRTL ? 'font-cairo' : 'font-montserrat'}`}>
          <CardHeader className="space-y-2 pb-6">
            <div className="mx-auto mb-2">
              <Image 
                src={getAppImageUrl("/images/drinkmate-logo.png")}
                style={{ width: "auto", height: "auto" }} 
                alt="Drinkmate" 
                width={150} 
                height={50} 
                className="h-10 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              {isRTL ? "مرحباً بعودتك" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isRTL ? "سجّل الدخول إلى حسابك للمتابعة" : "Sign in to your account to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Status/Error Messages */}
            {messageType === "error" && errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{isRTL ? "خطأ" : "Error"}</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {messageType === "success" && statusMessage && (
              <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{isRTL ? "نجاح" : "Success"}</AlertTitle>
                <AlertDescription>{statusMessage}</AlertDescription>
              </Alert>
            )}
            
            {messageType === "info" && errorMessage && (
              <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
                <Info className="h-4 w-4" />
                <AlertTitle>{isRTL ? "معلومة" : "Information"}</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    {isRTL ? "البريد الإلكتروني" : "Email Address"}
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder={isRTL ? "example@domain.com" : "name@example.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      dir={isRTL ? "rtl" : "ltr"}
                      className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} border-gray-300 focus:border-[#12d6fa] focus:ring-[#12d6fa] transition-colors`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                    <Label htmlFor="password" className="text-gray-700">
                      {isRTL ? "كلمة المرور" : "Password"}
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[#12d6fa] hover:text-[#0fb8d9] transition-colors"
                    >
                      {t("auth.forgotPassword") || (isRTL ? "نسيت كلمة المرور؟" : "Forgot password?")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5`} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      dir="ltr"
                      className="px-10 border-gray-300 focus:border-[#12d6fa] focus:ring-[#12d6fa] transition-colors"
                    />
                    <button 
                      type="button"
                      className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors`}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? (isRTL ? "إخفاء كلمة المرور" : "Hide password") : (isRTL ? "إظهار كلمة المرور" : "Show password")}
                    >
                      <Image
                        src={showPassword ? getAppImageUrl("/images/miscellaneous/hide.png") : getAppImageUrl("/images/miscellaneous/view.png")}
                        alt={showPassword ? (isRTL ? "إخفاء" : "Hide password") : (isRTL ? "إظهار" : "Show password")}
                        width={20}
                        height={20}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isRTL ? (
                    <>
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 cursor-pointer"
                      >
                        تذكّرني
                      </label>
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                    </>
                  ) : (
                    <>
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#12d6fa] hover:bg-[#0fb8d9] text-white transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {isRTL ? "جارٍ تسجيل الدخول..." : "Signing in..."}
                    </span>
                  ) : (
                    t("auth.signIn") || (isRTL ? "تسجيل الدخول" : "Sign In")
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-gray-200 pt-6">
            <div className="text-center text-sm text-gray-600">
              {t("auth.dontHaveAccount") || (isRTL ? "ليس لديك حساب؟" : "Don't have an account?")}{" "}
              <Link href="/register" className="text-[#12d6fa] hover:text-[#0fb8d9] font-medium transition-colors">
                {t("auth.createAccount") || (isRTL ? "إنشاء حساب" : "Create an account")}
              </Link>
            </div>
          </CardFooter>
        </Card>
        </div>
      </PageLayout>
    </Suspense>
  );
}
