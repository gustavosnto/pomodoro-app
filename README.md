# PomoTimer – Expo/React Native

Este é um aplicativo de Pomodoro moderno chamado **PomoTimer**, criado com [Expo](https://expo.dev) e React Native, focado em produtividade e experiência de usuário.

## Funcionalidades

- **Timer PomoTimer**: Temporizador clássico para ciclos de trabalho focado.
- **Ciclos automáticos**: Alterna automaticamente entre trabalho, pausa curta e pausa longa, com contagem de ciclos.
- **Configuração Personalizada**: Defina o tempo de trabalho, pausa curta, pausa longa e número de ciclos antes da pausa longa.
- **Notificações Locais**: Receba notificações quando o tempo acabar, mesmo se o app estiver minimizado ou fechado (em build de desenvolvimento).
- **Vibração**: Vibração nos últimos segundos do ciclo para alertar o usuário.
- **Bloqueio de Tela**: Mantém a tela acordada enquanto o timer está rodando.
- **Styled-components**: Interface moderna e responsiva, com componentes estilizados.
- **Modal de Configurações**: Ajuste fácil dos tempos e ciclos, com validação de entrada.
- **Visualização Circular**: Barra de progresso circular animada para o timer.
- **Acessível em iOS e Android**: Suporte completo para ambos os sistemas.
- **Persistência de Estado**: Timer continua funcionando mesmo ao alternar entre apps (notificações).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Inicie o app

   ```bash
   npx expo start
   ```

> **Atenção:** Para testar notificações e funcionalidades completas, use um [development build](https://docs.expo.dev/develop/development-builds/introduction/) com `npx expo run:ios` ou `npx expo run:android`. O Expo Go possui limitações para notificações.

Você pode começar a desenvolver editando os arquivos dentro do diretório **app**. Este projeto utiliza [file-based routing](https://docs.expo.dev/router/introduction).

## Splash Screen

A splash screen personalizada é exibida ao abrir o app. A imagem pode ser alterada em `assets/images/splash-icon.png` e configurada em `app.json`.

## Saiba mais

- [Documentação do Expo](https://docs.expo.dev/)
- [Tutorial Expo](https://docs.expo.dev/tutorial/introduction/)

---

Desenvolvido com ❤️ usando Expo, React Native e styled-components.
