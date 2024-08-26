import groq from 'groq'

export const GLOBAL = groq`*[_type == "global"][0]`
