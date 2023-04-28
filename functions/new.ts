interface Env {
    GAME_STATE: DurableObjectNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {    
    const gameId = context.env.GAME_STATE.newUniqueId();
    const stub = context.env.GAME_STATE.get(gameId);
        
    return stub.fetch(context.request);
}