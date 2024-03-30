import Vapi from "@vapi-ai/web";
import { envConfig } from "../../config/env.config";


// TODO: Might have to monkeypatch to make this.call public instead of private
export const vapi = new Vapi(envConfig.vapi.token);


