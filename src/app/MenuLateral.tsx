/** @jsxRuntime classic */
import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    ScrollView,
} from 'react-native';

import {
    User,
    X,
    CalendarDays,
    CircleCheck,
    RefreshCw,
    LogOut,
} from 'lucide-react-native';


export default function App() {

    // Função para acessar as seções
    const acessarSecao = (secao: string) => {

        Alert.alert(
            'Acessar seção',
            `Você selecionou: ${secao}`
        );

    };


    // Função para sair da conta
    const sairDaConta = () => {

        Alert.alert(
            'Sair da conta',
            'Deseja realmente sair da sua conta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Sistema', 'Você saiu da sua conta!');
                    },
                },
            ]
        );

    };


    // Componente de opção do menu
    const MenuItem = ({
        titulo,
        descricao,
        icone,
        onPress,
    }: {
        titulo: string;
        descricao: string;
        icone: React.ReactNode;
        onPress: () => void;
    }) => (

        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >

            <View style={styles.iconContainer}>
                {icone}
            </View>

            <View style={styles.menuTextContainer}>

                <Text style={styles.menuTitle}>
                    {titulo}
                </Text>

                <Text style={styles.menuDescription}>
                    {descricao}
                </Text>

            </View>

        </TouchableOpacity>

    );


    return (

        <SafeAreaView style={styles.container}>

            <StatusBar
                backgroundColor="#1949C5"
                barStyle="light-content"
            />


            {/* CABEÇALHO */}

            <View style={styles.header}>

                <View style={styles.headerContent}>

                    <View style={styles.avatar}>

                        <User
                            size={23}
                            color="#394A83"
                            fill="#394A83"
                        />

                    </View>


                    <View style={styles.studentInfo}>

                        <Text style={styles.headerTitle}>
                            ME   Mobile Educational
                        </Text>

                        <Text style={styles.studentName}>
                            Ana Beatriz Silva - Mat.
                        </Text>

                        <Text style={styles.studentRegistration}>
                            2024005847
                        </Text>

                    </View>


                    <TouchableOpacity
                        onPress={() => acessarSecao('Fechar menu')}
                    >

                        <X
                            size={23}
                            color="#DCE5FF"
                        />

                    </TouchableOpacity>

                </View>

            </View>


            {/* CONTEÚDO PRINCIPAL */}

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/* INFORMAÇÕES DA ESCOLA */}

                <View style={styles.schoolCard}>

                    <Text style={styles.schoolLogo}>
                        ME
                    </Text>

                    <View style={styles.schoolInfo}>

                        <Text style={styles.schoolName}>
                            EMEF Prof. Adalberto Lima
                        </Text>

                        <Text style={styles.schoolShift}>
                            Turno Manhã · 2024
                        </Text>

                    </View>

                </View>


                {/* TÍTULO DA SEÇÃO */}

                <Text style={styles.sectionTitle}>
                    ACESSAR SEÇÃO
                </Text>


                {/* CALENDÁRIO ESCOLAR */}

                <MenuItem
                    titulo="Calendário Escolar"
                    descricao="Feriados, provas e eventos"
                    icone={
                        <CalendarDays
                            size={19}
                            color="#2056ED"
                        />
                    }
                    onPress={() => acessarSecao('Calendário Escolar')}
                />


                {/* ATIVIDADES E TAREFAS */}

                <MenuItem
                    titulo="Atividades e Tarefas"
                    descricao="Pendentes e concluídas"
                    icone={
                        <CircleCheck
                            size={20}
                            color="#2056ED"
                        />
                    }
                    onPress={() => acessarSecao('Atividades e Tarefas')}
                />


                {/* REMATRÍCULA */}

                <MenuItem
                    titulo="Rematrícula"
                    descricao="Confirmar para 2025/2026"
                    icone={
                        <RefreshCw
                            size={20}
                            color="#2056ED"
                        />
                    }
                    onPress={() => acessarSecao('Rematrícula')}
                />

            </ScrollView>


            {/* RODAPÉ */}

            <View style={styles.footer}>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={sairDaConta}
                    activeOpacity={0.7}
                >

                    <LogOut
                        size={17}
                        color="#ED3030"
                    />

                    <Text style={styles.logoutText}>
                        Sair da conta
                    </Text>

                </TouchableOpacity>

            </View>

        </SafeAreaView>

    );

}



// ESTILIZAÇÃO DO MENU

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },


    // CABEÇALHO

    header: {
        backgroundColor: '#1949C5',
        paddingHorizontal: 17,
        paddingTop: 20,
        paddingBottom: 23,
    },

    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    avatar: {
        width: 43,
        height: 43,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },

    studentInfo: {
        flex: 1,
    },

    headerTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 3,
    },

    studentName: {
        fontSize: 11,
        color: '#E0E8FF',
    },

    studentRegistration: {
        fontSize: 11,
        color: '#E0E8FF',
        marginTop: 2,
    },


    // CONTEÚDO

    content: {
        flex: 1,
        paddingHorizontal: 14,
        paddingTop: 14,
    },


    // CARTÃO DA ESCOLA

    schoolCard: {
        height: 59,
        backgroundColor: '#F0F3FC',
        borderWidth: 1,
        borderColor: '#D3DDF5',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 12,
        marginBottom: 16,
    },

    schoolLogo: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1749C5',
    },

    schoolInfo: {
        flex: 1,
    },

    schoolName: {
        fontSize: 12,
        color: '#173477',
        marginBottom: 3,
    },

    schoolShift: {
        fontSize: 11,
        color: '#7484A8',
    },


    // TÍTULO DA SEÇÃO

    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#7C8BA9',
        letterSpacing: 1,
        marginHorizontal: 3,
        marginBottom: 12,
    },


    // OPÇÕES DO MENU

    menuItem: {
        height: 61,
        backgroundColor: '#F7F8FC',
        borderWidth: 1,
        borderColor: '#D5DEF1',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        marginBottom: 7,
    },

    iconContainer: {
        width: 35,
        height: 35,
        backgroundColor: '#EDF1FF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 11,
    },

    menuTextContainer: {
        flex: 1,
    },

    menuTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#202E50',
        marginBottom: 3,
    },

    menuDescription: {
        fontSize: 11,
        color: '#7D8CAB',
    },


    // RODAPÉ

    footer: {
        height: 85,
        borderTopWidth: 1,
        borderTopColor: '#D5DEF1',
        paddingHorizontal: 14,
        paddingTop: 18,
        backgroundColor: '#FFFFFF',
    },

    logoutButton: {
        height: 44,
        backgroundColor: '#FFE5E5',
        borderWidth: 1,
        borderColor: '#FFC4C4',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },

    logoutText: {
        fontSize: 13,
        color: '#ED3030',
        fontWeight: '500',
    },

});