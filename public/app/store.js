function Store()
{
    const store = window.localStorage;
    if ( !store){
        throw new Error('localStorage not available')
    }

    let pushAvailable = false;


    this.push = function (key, value)
    {
        fetch(`/api/${key}.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: value
        }).then(_ => {
            pushAvailable = true
        })
            .then(response => response.json())
            .catch(_ => {
           pushAvailable = false;
        });
    }


    this.setItem = function (key, value)
    {
        store.setItem(key, value)

       this.push(key, value);
    }

    this.getItem = function (key)
    {

        try
        {
            fetch(`/api/${key}.json`)
                .then(response => {
                    if ( response.status === 200)
                    {
                        return response.text();
                    }
                    throw new  Error('test');
                })
                .then(json => {
                    if ( pushAvailable === false)
                    {
                        return;
                    }

                    store.setItem(key, json);
                });

        }
        catch (Error)
        {
        }

        return store.getItem(key);
    }
}




export default Store;