import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

const Auth = () => {
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome to Recipe Visualizer</h2>
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#f97316',
                brandAccent: '#ea580c',
              },
            },
          },
          className: {
            container: 'auth-container',
            button: 'auth-button',
            anchor: 'auth-anchor',
          },
        }}
        providers={['google']}
        redirectTo={`${window.location.origin}/auth/callback`}
        onlyThirdPartyProviders={false}
        view="sign_in"
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email address',
              password_label: 'Password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in...',
              social_provider_text: 'Sign in with {{provider}}',
            },
          },
        }}
      />
    </div>
  );
};

export default Auth;