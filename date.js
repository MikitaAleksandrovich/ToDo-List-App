// jshnit esversion:6

exports.getDate = getDate = () => {

    const today = new Date();

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    
    return today.toLocaleDateString('en-US', options);

};

