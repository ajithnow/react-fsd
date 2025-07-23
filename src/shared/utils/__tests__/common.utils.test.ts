import { generateResources } from '../common.utils';
import type { GenerateResourcesOptions } from '../../models/common.model';

describe('generateResources', () => {
  it('should generate resources correctly with valid input', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        auth: {
          en: {
            login: {
              title: 'Login',
              username: 'Username',
              password: 'Password',
            },
          },
          es: {
            login: {
              title: 'Iniciar sesión',
              username: 'Nombre de usuario',
              password: 'Contraseña',
            },
          },
        },
        dashboard: {
          en: {
            navigation: {
              welcome: 'Welcome',
              profile: 'Profile',
            },
          },
          es: {
            navigation: {
              welcome: 'Bienvenido',
              profile: 'Perfil',
            },
          },
        },
      },
      supportedLanguages: ['en', 'es'],
      features: ['auth', 'dashboard'],
    };

    const result = generateResources(options);

    expect(result).toEqual({
      resources: {
        en: {
          auth: {
            login: {
              title: 'Login',
              username: 'Username',
              password: 'Password',
            },
          },
          dashboard: {
            navigation: {
              welcome: 'Welcome',
              profile: 'Profile',
            },
          },
        },
        es: {
          auth: {
            login: {
              title: 'Iniciar sesión',
              username: 'Nombre de usuario',
              password: 'Contraseña',
            },
          },
          dashboard: {
            navigation: {
              welcome: 'Bienvenido',
              profile: 'Perfil',
            },
          },
        },
      },
      supportedLanguages: ['en', 'es'],
      features: ['auth', 'dashboard'],
    });
  });

  it('should handle missing language translations gracefully', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        auth: {
          en: {
            login: {
              title: 'Login',
              username: 'Username',
            },
          },
          // Missing 'es' translations for auth
        },
        dashboard: {
          en: {
            navigation: {
              welcome: 'Welcome',
            },
          },
          es: {
            navigation: {
              welcome: 'Bienvenido',
            },
          },
        },
      },
      supportedLanguages: ['en', 'es'],
      features: ['auth', 'dashboard'],
    };

    const result = generateResources(options);

    expect(result.resources).toEqual({
      en: {
        auth: {
          login: {
            title: 'Login',
            username: 'Username',
          },
        },
        dashboard: {
          navigation: {
            welcome: 'Welcome',
          },
        },
      },
      es: {
        auth: {}, // Should be empty object when translations are missing
        dashboard: {
          navigation: {
            welcome: 'Bienvenido',
          },
        },
      },
    });
  });

  it('should handle empty modules', () => {
    const options: GenerateResourcesOptions = {
      modules: {},
      supportedLanguages: ['en', 'es'],
      features: [],
    };

    const result = generateResources(options);

    expect(result.resources).toEqual({
      en: {},
      es: {},
    });
    expect(result.supportedLanguages).toEqual(['en', 'es']);
    expect(result.features).toEqual([]);
  });

  it('should handle single language', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        common: {
          en: {
            actions: {
              save: 'Save',
              cancel: 'Cancel',
            },
          },
        },
      },
      supportedLanguages: ['en'],
      features: ['common'],
    };

    const result = generateResources(options);

    expect(result.resources).toEqual({
      en: {
        common: {
          actions: {
            save: 'Save',
            cancel: 'Cancel',
          },
        },
      },
    });
    expect(result.supportedLanguages).toEqual(['en']);
    expect(result.features).toEqual(['common']);
  });

  it('should handle empty supported languages array', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        auth: {
          en: {
            login: {
              title: 'Login',
            },
          },
        },
      },
      supportedLanguages: [],
      features: ['auth'],
    };

    const result = generateResources(options);

    expect(result.resources).toEqual({});
    expect(result.supportedLanguages).toEqual([]);
    expect(result.features).toEqual(['auth']);
  });

  it('should preserve the original input parameters', () => {
    const originalOptions: GenerateResourcesOptions = {
      modules: {
        test: {
          en: {
            section: {
              key: 'value',
            },
          },
        },
      },
      supportedLanguages: ['en'],
      features: ['test'],
    };

    const result = generateResources(originalOptions);

    // Verify that original objects are not mutated
    expect(originalOptions.modules).toEqual({
      test: {
        en: {
          section: {
            key: 'value',
          },
        },
      },
    });
    expect(originalOptions.supportedLanguages).toEqual(['en']);
    expect(originalOptions.features).toEqual(['test']);

    // Verify that returned values match input
    expect(result.supportedLanguages).toBe(originalOptions.supportedLanguages);
    expect(result.features).toBe(originalOptions.features);
  });

  it('should handle complex nested structure', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        forms: {
          en: {
            validation: {
              error: 'Validation Error',
              required: 'This field is required',
              email: 'Invalid email format',
            },
          },
          fr: {
            validation: {
              error: 'Erreur de validation',
              required: 'Ce champ est obligatoire',
              email: 'Format d\'email invalide',
            },
          },
        },
        navigation: {
          en: {
            menu: {
              home: 'Home',
              about: 'About',
              contact: 'Contact',
            },
          },
          fr: {
            menu: {
              home: 'Accueil',
              about: 'À propos',
              contact: 'Contact',
            },
          },
        },
      },
      supportedLanguages: ['en', 'fr'],
      features: ['forms', 'navigation'],
    };

    const result = generateResources(options);

    expect(result.resources.en).toHaveProperty('forms');
    expect(result.resources.en).toHaveProperty('navigation');
    expect(result.resources.fr).toHaveProperty('forms');
    expect(result.resources.fr).toHaveProperty('navigation');

    expect(result.resources.en.forms.validation).toEqual({
      error: 'Validation Error',
      required: 'This field is required',
      email: 'Invalid email format',
    });
    expect(result.resources.fr.forms.validation).toEqual({
      error: 'Erreur de validation',
      required: 'Ce champ est obligatoire',
      email: 'Format d\'email invalide',
    });
  });

  it('should handle real-world auth module structure', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        auth: {
          en: {
            login: {
              title: 'Login to your account',
              usernameLabel: 'Username',
              passwordLabel: 'Password',
              loginButton: 'Login',
              loadingButton: 'Logging In...',
              usernameRequired: 'Username is required',
              passwordRequired: 'Password is required',
              loginFailedError: 'Login failed. Please check your credentials.',
            },
          },
        },
      },
      supportedLanguages: ['en'],
      features: ['auth'],
    };

    const result = generateResources(options);

    expect(result.resources.en.auth.login).toEqual({
      title: 'Login to your account',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      loginButton: 'Login',
      loadingButton: 'Logging In...',
      usernameRequired: 'Username is required',
      passwordRequired: 'Password is required',
      loginFailedError: 'Login failed. Please check your credentials.',
    });
  });

  it('should handle partial module translations', () => {
    const options: GenerateResourcesOptions = {
      modules: {
        notifications: {
          en: {
            messages: {
              success: 'Success!',
              error: 'Error occurred',
            },
          },
          es: {
            messages: {
              success: '¡Éxito!',
              // Missing error translation
            },
          },
        },
      },
      supportedLanguages: ['en', 'es'],
      features: ['notifications'],
    };

    const result = generateResources(options);

    expect(result.resources.en.notifications.messages).toEqual({
      success: 'Success!',
      error: 'Error occurred',
    });

    expect(result.resources.es.notifications.messages).toEqual({
      success: '¡Éxito!',
    });
  });
});
