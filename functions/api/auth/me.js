import {json,getSession} from '../../_lib.js';
export async function onRequestGet({request,env}){return json({user:await getSession(request,env)})}
