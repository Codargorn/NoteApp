function Proxy(url)
{
    const proxy = window.navigator.serviceWorker;
    if ( !proxy){
        throw new Error('serviceWorker not available')
    }

    proxy.register(url);
}

export default Proxy;