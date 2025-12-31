import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import denied from "../assets/denied.png";
import {
  Alert,
  Box,
  Button,
  Container,
  Field,
  Fieldset,
  Input,
  Stack,
  Image,
  Center,
} from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async () => {
    console.info("redirect url: " + window.location.origin);
    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/axolotl-kitchen/`,
      },
    });
    toaster.create({
      description:
        "Check your email for the login link. You will be redirected automatically to: " +
        `${window.location.origin}/axolotl-kitchen/`,
      type: "info",
    });
  };

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return (
      <Box p={4}>
        <Container maxW="480px" w="full" px={0}>
          <Center maxW="480px">
            <Image
              src={denied}
              boxSize="150px"
              borderRadius="full"
              fit="cover"
              alt="Access denied"
            />
          </Center>

          <Alert.Root status="info" variant="subtle" my={8}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Halt! Who goes there?</Alert.Title>
              <Alert.Description>
                <Fieldset.Root>
                  <Stack>
                    <Fieldset.Legend>
                      Summon your magical OTP using the email you signed up with
                      — or the universe will just shrug 😅
                    </Fieldset.Legend>
                    <Fieldset.HelperText>
                      OTPs only visit emails on the VIP list. If your inbox is
                      quieter than a sleeping axolotl, that’s why!
                    </Fieldset.HelperText>
                  </Stack>

                  <Fieldset.Content>
                    <Field.Root required orientation="horizontal">
                      <Field.Label>
                        Email
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        placeholder="Email id for the OTP"
                        variant="subtle"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field.Root>
                    <Button onClick={login}>Request an OTP link</Button>
                  </Fieldset.Content>
                </Fieldset.Root>
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </Container>
      </Box>
    );
  }

  return <>{children}</>;
}
