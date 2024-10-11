import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { View, Text, ScrollView, Switch, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import userApi from '../../api/user.api';
import Loading from '../../components/Loading';  // Custom loading component
import conversationApi from '../../api/conversation.api';

const ToolSettings: React.FC = () => {
    const queryClient = useQueryClient();
    const [tools, setTools] = useState([]);
    // Fetch tools using React Query
    const { data: totalsData, isLoading, error } = useQuery(
        {
            queryKey: ['tools'],
            queryFn: () => userApi.getTools(),
        }
    );

    // Mutation to toggle tool assignment
    const toggleToolMutation = useMutation({
        mutationFn: (toolID: string) => userApi.toggleTool(toolID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tools'] }); // Refetch tools after mutation success
        },
        onError: (error) => {
            console.error('Error toggling tool:', error);
            Alert.alert('Error', 'Failed to toggle tool. Please try again.');
        },
    });

    // Handler for toggling a tool
    const handleToggleTool = (toolId: string, assigned: boolean) => {
        toggleToolMutation.mutate(toolId);
    };

    useEffect(() => {
        if(totalsData?.data) {
            setTools(totalsData.data);
        }
    }, [totalsData]);

    if (isLoading) return <Loading />;  // Custom loading component
    if (error) return <Text>Error fetching tools: {error.message}</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Tools</Text>
            </View>

            <View style={styles.toolsWrapper}>
                {tools && tools.length > 0 ? (
                    tools.map((tool: any) => (
                        <View key={tool.id} style={styles.switchContainer}>
                            <View style={styles.label}>
                                <Text style={styles.toolName}>{tool.name}</Text>
                                <Text style={styles.toolDescription}>{tool.description}</Text>
                            </View>
                            <Switch
                                value={tool.assigned}
                                onValueChange={() => handleToggleTool(tool.id, tool.assigned)}
                            />
                        </View>
                    ))
                ) : (
                    <Text>No tools available.</Text>
                )}
            </View>
        </View>
    );
};

export default ToolSettings;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    titleWrapper: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#cfcfcf',
        paddingBottom: 10,
    },
    toolsWrapper: {
        borderWidth: 1,
        borderColor: '#cfcfcf',
        borderRadius: 10,
        padding: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cfcfcf',
    },
    label: {
        flex: 1,
    },
    toolName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    toolDescription: {
        fontSize: 12,
        color: '#666',
    },
});
