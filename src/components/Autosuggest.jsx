import React, {useEffect, useState} from 'react';
import Autosuggest from 'react-autosuggest';

const AutoSuggestComponent = ({list = [], placeholder = 'Type a location'}) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : suggestions.filter(item =>
            item.name.toLowerCase().includes(inputValue)
        );
    };

    const getSuggestionValue = suggestion => suggestion.name;

    const renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    const onSuggestionChange = (event, {newValue}) => {
        setValue(newValue);
    };

    const inputProps = {
        placeholder,
        value,
        onChange: onSuggestionChange
    };

    useEffect(() => {
        setSuggestions(list);
    }, [list])

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsClearRequested={() => setSuggestions(list)}
            onSuggestionsFetchRequested={({ value }) => {
                setValue(value);
                setSuggestions(getSuggestions(value));
            }}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            highlightFirstSuggestion={true}
        />
    )
};

export default AutoSuggestComponent;
