"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { signIn } from "next-auth/react";

import { loginSchema, type LoginInput } from "@/lib/validators";
import { loginAction } from "@/lib/actions/auth.actions";
import { ROUTES } from "@/constants/routes";

export function useLoginForm() {
  const [signingIn, setSigningIn] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { execute, isPending, result } = useAction(loginAction, {
    onSuccess: async ({ data }) => {
      if (data && "success" in data && data.success) {
        setSigningIn(true);
        const values = form.getValues();
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: ROUTES.dashboard,
        });
        // signIn with redirect:true (default) navigates away.
      }
    },
  });

  const serverError =
    result?.data && "error" in result.data ? result.data.error : null;

  const isLoading = isPending || signingIn;

  function onSubmit(values: LoginInput) {
    execute(values);
  }

  return {
    form,
    serverError,
    isLoading,
    onSubmit,
  };
}
