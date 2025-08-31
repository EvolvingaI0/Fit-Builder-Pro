
import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface ListItem {
    id: number;
    text: string;
    category: string;
    completed: boolean;
}

function ShoppingList() {
    const { currentUser } = useAuth();
    const storageKey = currentUser ? `fitBuilderProShoppingList_v2_${currentUser.email}` : '';
    const [list, setList] = useLocalStorage<ListItem[]>(storageKey, []);
    const [newItemText, setNewItemText] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemText.trim() === '') return;

        const newItem: ListItem = {
            id: Date.now(),
            text: newItemText.trim(),
            category: newItemCategory.trim() || 'Outros',
            completed: false,
        };
        setList(prev => [...prev, newItem].sort((a,b) => a.category.localeCompare(b.category)));
        setNewItemText('');
        setNewItemCategory('');
    };

    const toggleItem = (id: number) => {
        setList(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    const removeItem = (id: number) => {
        setList(prev => prev.filter(item => item.id !== id));
    };

    const clearCompleted = () => {
        setList(prev => prev.filter(item => !item.completed));
    };
    
    const clearAll = () => {
        if (window.confirm('Tem certeza que deseja limpar toda a lista?')) {
            setList([]);
        }
    }

    const completedCount = list.filter(item => item.completed).length;
    const totalCount = list.length;

    const groupedItems = list.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<string, ListItem[]>);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Lista de Compras</h1>
            <Card>
                <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Adicionar item (ex: Ovos, Aveia...)"
                        className="flex-grow p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <input
                        type="text"
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value)}
                        placeholder="Categoria (ex: Laticínios)"
                        className="sm:w-48 p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <Button type="submit" className="px-5">
                        <PlusIcon className="w-5 h-5"/>
                    </Button>
                </form>

                <div className="space-y-4">
                    {list.length > 0 ? (
                        Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-lg font-bold text-primary mb-2 border-b-2 border-primary/20 pb-1">{category}</h3>
                                <div className="space-y-2">
                                    {items.map(item => (
                                         <div key={item.id} className={`flex items-center p-3 rounded-lg transition-all duration-300 ${item.completed ? 'bg-green-50' : 'bg-background'}`}>
                                            <label className="flex items-center cursor-pointer flex-grow">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => toggleItem(item.id)}
                                                className="h-5 w-5 rounded-md text-primary focus:ring-primary border-gray-300 cursor-pointer"
                                            />
                                            <span className={`ml-4 text-lg transition-colors ${item.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                                                {item.text}
                                            </span>
                                            </label>
                                            <button onClick={() => removeItem(item.id)} className="ml-auto text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-text-secondary py-4">Sua lista de compras está vazia.</p>
                    )}
                </div>
                
                 {list.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <p className="text-sm font-semibold text-text-secondary">{completedCount} de {totalCount} itens concluídos.</p>
                             <div className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={clearCompleted} variant="secondary" disabled={completedCount === 0}>Limpar Concluídos</Button>
                                <Button onClick={clearAll} variant="danger">Limpar Tudo</Button>
                            </div>
                         </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ShoppingList;
