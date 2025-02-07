# Ollama chat assistant

A minimalistic web app chat assistant powered by ollama.

# Getting started

## Setup ollama
1. Install ollama: [link](https://github.com/ollama/ollama?tab=readme-ov-file#ollama)
2. Pull the desired model: 
    `ollama pull <model>`
3. serve ollama:
    `ollama serve`

## Setup project
1. Install node && yarn
2. Run `yarn install`

## Start App

To start the app, run: `yarn dev`

By default the App will use the `llama3.1:1b` model. You can override this by exporting the VITE_LLM_MODEL
prior to executing the dev command:
`VITE_LLM_MODEL=<desired_model>; yarn dev`
