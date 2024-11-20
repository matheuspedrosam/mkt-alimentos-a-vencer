import { useState, useRef, Dispatch, Ref } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { API_KEY } from "@env";
import { mainStyles } from '../utils/mainStyles';
import { Icon } from '@rneui/base';
import useFetchData from '../hooks/useFetchData';
import useUserStore from '../store/user';

export interface GooglePlacesAutoCompleteProps {
    location: string,
    setLocation: Dispatch<any>,
    modalRef: React.MutableRefObject<any>
    setLoading: Dispatch<any>,
}

const GooglePlacesAutocomplete = (props: GooglePlacesAutoCompleteProps) => {
    const { updateData } = useFetchData();
    const { user, setUser } = useUserStore();

    const { location, setLocation, modalRef, setLoading } = props;

    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState([]);
    const controllerRef = useRef(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const fetchPlaces = async (input: string) => {
        // Abortar a requisição anterior, se houver
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        // Criar um novo AbortController para esta requisição
        const controller = new AbortController();
        controllerRef.current = controller;

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}&language=pt-BR`;

        try {
            const response = await fetch(url, { signal: controller.signal });
            const data = await response.json();

            if (data.status === 'OK') {
                setPredictions(data.predictions);
            } else {
                console.error('Google API Error:', data.error_message);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Requisição abortada');
            } else {
                console.error('Erro ao buscar locais:', error);
            }
        }
    };

    const handleInputChange = (text: string) => {
        setQuery(text);
        if (text.length > 2) {
            fetchPlaces(text);
        } else {
            setPredictions([]);
        }
    };

    const handleSelectPlace = (place: any) => {
        setSelectedPlace(place.description);
        setQuery(place.description);
        setPredictions([]);
    };

    async function handleChangeLocation(){
        if(!selectedPlace) return;

        setLoading(true);
        try{
            const address = selectedPlace;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`; 
            const res = await fetch(url);
            const geocode = await res.json();
            const geometryLocation = geocode.results[0].geometry.location;
            const { lat, lng } = geometryLocation;
            const newLocation = {latitude: lat, longitude: lng, description: selectedPlace};
            const userForUpdate = {...user, lastLocation: newLocation}; 
            delete userForUpdate.id;
            await updateData("users", user.id, userForUpdate);
            setLocation(newLocation);
        } catch(e){
            console.log(e);
        } finally{
            modalRef.current.close();
            setLoading(false);
        }
    }

    return (
        <View>
            <View style={{marginBottom: predictions.length == 0 ? 200: 20}}>
                <View style={[styles.inputContainer, predictions.length > 0 && {borderBottomRightRadius: 0, borderBottomLeftRadius: 0}]}>
                    <Icon name='search'/>
                    <TextInput
                        value={query}
                        onChangeText={handleInputChange}
                        placeholderTextColor='black'
                        style={styles.input}
                        placeholder='Buscar local'/>
                </View>
                <View style={styles.suggestionsList}>
                    {predictions.length > 0 && predictions.map((item) => (
                        <TouchableOpacity key={item.place_id} onPress={() => handleSelectPlace(item)}>
                            <Text style={styles.suggestion}>{item.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleChangeLocation}>
                <Text style={styles.btnText}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#d3d3d3',
        flex: 1,
    },
    input: {
        width: '100%',
        padding: 12,
        paddingHorizontal: 5,
        fontWeight: '500',
    },
    suggestionsList: {
        // marginTop: 10,
        // borderRadius: 5,
        // elevation: 2,
        backgroundColor: "rgb(250, 250, 250)", 
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden',
        marginBottom: 20
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    btn: {
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 12,
        borderRadius: 4,
        textAlign: 'center'
    },
    btnText: {
        color: 'white',
        textAlign: 'center'
    },
});

export default GooglePlacesAutocomplete;