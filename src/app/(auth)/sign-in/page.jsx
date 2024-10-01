"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { set } from "mongoose";
import { reducer } from "./../../../hooks/use-toast";

const Page = () => {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const debouncedUserName = useDebounceValue(userName, 300);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   const checkUserName = async () => {
  //     if (debouncedUserName) {
  //       setIsCheckingUserName(true);
  //       setUserNameMessage("");

  //       try {
  //         const response = await axios.get(`/api/check-username-unique?userName=${debouncedUserName}`);
  //         setUserNameMessage(response.data.message);
  //       } catch (error) {
  //         setUserNameMessage(error.response.data.message);
  //       } finally {
  //         setIsCheckingUserName(false);
  //       }
  //     }
  //   };

  //   checkUserName();
  // }, [debouncedUserName]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up");
      if (response.data.success) {
        toast({
          title: "User created successfully",
          status: "success",
        });
        router.replace(`/verify/${userName}`);
      }

      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "User creation failed",
        status: "error",
      });
      setIsSubmitting(false);
    }
  };

  return <div>sdfd</div>;
};

export default Page;
