# Ollama AI Assistant

A minimalistic, web-based AI assistant powered by [Ollama](https://ollama.com/).  
**Ollama enables you to run large language models locally on your own machine—no cloud required, no data leaves your device.**  
_Bring your own model and keep your data private!_

[![Watch the demo](https://drive.google.com/file/d/1So2LkN-vT8QHsldwYUiq27YjxEU_jfut/view)](https://drive.google.com/file/d/1So2LkN-vT8QHsldwYUiq27YjxEU_jfut/view)

---

## Why Ollama?

- **Local-first:** All AI models run on your hardware—your data stays with you.
- **Flexible:** Choose and switch between different open-source models.
- **Private & Secure:** No third-party servers or cloud APIs involved.

---

## Getting Started

### 1. Set Up Ollama

1. **Install Ollama:** [Installation Guide](https://github.com/ollama/ollama?tab=readme-ov-file#ollama)
2. **Pull your desired model:**
   ```sh
   ollama pull <model>
   ```
3. **Start the Ollama server:**
   ```sh
   ollama serve
   ```

### 2. Set Up This Project

1. **Install Node.js & Yarn**
2. **Install dependencies:**
   ```sh
   yarn install
   ```

### 3. Start the App

To launch the app, run:

```sh
yarn dev
```

By default, the app uses the `llama3.1:1b` model.  
To use a different model, set the `VITE_LLM_MODEL` environment variable before starting:

```sh
VITE_LLM_MODEL=<desired_model> yarn dev
```

---

## Linting

To check the code for linting issues, run:

```sh
yarn lint
```

To automatically fix some linting issues:

```sh
yarn lint --fix
```

---

**Note: this project is improving every day. Be patient in case of bugs xD!**
