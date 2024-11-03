import { categories } from "../db/mockedDb";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { mainStyles } from "../utils/mainStyles";

export interface CategoryProps {
    name: string;
    selectedCategory?: boolean
    setCategory: (category: string) => void;
}

function CategoryButton({ name, selectedCategory, setCategory }: CategoryProps) {
    return (
        <TouchableOpacity onPress={() => setCategory(name)} style={[styles.categoryButton, selectedCategory && styles.selectedCategory]}>
            <Text style={[styles.categoryButtonText, selectedCategory && styles.selectedCategoryText]}>{name}</Text>
        </TouchableOpacity>
    );
}

export interface CategoriesListProps {
    category: string
    setCategory: (category: string) => void;
}

export function CategoriesList({ category, setCategory }: CategoriesListProps) {
    return (
        <View style={{ height: 40, marginTop: 10, marginBottom: 10 }}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <CategoryButton name={item.name} selectedCategory={category == item.name ? true : false} setCategory={setCategory} />
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    categoryButton: { 
        marginRight: 10,
        padding: 10,
        backgroundColor: mainStyles.mainColors.thirdColor,
        borderRadius: 10, 
        minWidth: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryButtonText: {
        color: mainStyles.mainColors.primaryColor,
        fontWeight: 'bold',
        fontSize: 16,
    },
    selectedCategory: {
        backgroundColor: mainStyles.mainColors.primaryColor
    },
    selectedCategoryText: {
        color: 'white',
    }
});