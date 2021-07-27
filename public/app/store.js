function Store() {
    const store = window.localStorage;
    if (!store) {
        throw new Error('localStorage not available')
    }

    this.push = async function (key, value) {
        await fetch(`/api/${key}.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: value
        });
    }

    this.setItem = async function (key, value) {
        await this.push(key, value);

        store.setItem(key, value)
    }

    this.getItem = async function (key) {
        try {
            await fetch(`/api/${key}.php`)
                .then( response => {
                    if (response.status === 200) {
                        return  response.text();
                    }
                    throw new Error('could not fetch data');
                })
                .then(json => {
                    store.setItem(key, json);
                });

        } catch (Error) {
        }

        return store.getItem(key);
    }
}


export default Store;