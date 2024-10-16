import { useState, FC, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { useAuth } from "context/AuthContext";
import { signIn } from "services/http/auth";

import AuthModal from "./AuthModal";
import LabeledInput from "@components/forms/LabeledInput";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(24, { message: "Password must have a maximum of 24 characters" }),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface SignInProps {
  navigation: {
    navigate: (route: string) => void;
  };
}

const SignIn: FC<SignInProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);

  const [isAuthenticationAccount, setIsAuthenticationAccount] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(() => {
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsAuthenticationAccount(true);
    handleSubmit(async data => {
      const response = await signIn(data, login);

      if (response?.token) {
        navigation.navigate("Home");
      }
    })();
    setIsAuthenticationAccount(false);
  }, [handleSubmit, navigation, step, login]);

  return (
    <AuthModal
      title="Login"
      buttonTitle={step === 1 ? "Continue" : "Enter"}
      onSubmit={onSubmit}
      isSubmiting={isAuthenticationAccount}>
      <>
        {step === 1 ? (
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <LabeledInput
                label="What is your email?"
                placeholder="example@gmail.com"
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
            name="email"
          />
        ) : (
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <LabeledInput
                label="Type your password"
                placeholder="****"
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
            name="password"
          />
        )}
      </>
    </AuthModal>
  );
};

export default SignIn;
