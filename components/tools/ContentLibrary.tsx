
import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import { BookOpenIcon, VideoCameraIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const contentData = [
    { id: 1, type: 'article', category: 'Nutrição', title: 'A Importância da Proteína na Musculação', summary: 'Descubra por que a proteína é crucial para o ganho muscular e como otimizar sua ingestão.', content: 'A proteína é um macronutriente essencial para a construção e reparo de tecidos musculares. Para quem pratica musculação, a ingestão adequada é fundamental para a hipertrofia. A recomendação geral varia entre 1.6 a 2.2 gramas de proteína por quilo de peso corporal. Boas fontes incluem frango, peixe, ovos, laticínios, leguminosas e suplementos como whey protein.' },
    { id: 2, type: 'video', category: 'Treino', title: 'Execução Correta do Agachamento', summary: 'Um guia passo a passo em vídeo para garantir que você execute o agachamento com segurança e eficácia.', videoUrl: 'https://www.youtube.com/embed/QhYFC_s_E1I' },
    { id: 3, type: 'article', category: 'Bem-Estar', title: 'Sono e Recuperação: O Pilar Esquecido', summary: 'Entenda como a qualidade do sono afeta diretamente seus resultados na academia e na vida.', content: 'Durante o sono, o corpo libera hormônios de crescimento e realiza a síntese proteica, processos vitais para a recuperação muscular. A falta de sono pode levar a um aumento do cortisol (hormônio do estresse), diminuir a performance e aumentar o risco de lesões. Priorize de 7 a 9 horas de sono por noite para otimizar seus ganhos.' },
    { id: 4, type: 'article', category: 'Nutrição', title: 'Carboidratos: Amigo ou Inimigo?', summary: 'Desmistificando o papel dos carboidratos em uma dieta para perda de peso e ganho de massa.', content: 'Carboidratos são a principal fonte de energia do corpo. Para treinos intensos, eles são indispensáveis. A chave está na escolha de carboidratos complexos (aveia, batata doce, arroz integral) que fornecem energia de forma gradual. Dietas muito restritivas em carboidratos podem prejudicar a performance e a recuperação.' },
    { id: 5, type: 'video', category: 'Treino', title: '5 Exercícios para um Abdômen Forte', summary: 'Aprenda os melhores exercícios para fortalecer seu core, com demonstrações em vídeo.', videoUrl: 'https://www.youtube.com/embed/fk_usVg7Fp0' },
];

type ContentItem = typeof contentData[0];
type Category = 'Todos' | 'Nutrição' | 'Treino' | 'Bem-Estar';
const categories: Category[] = ['Todos', 'Nutrição', 'Treino', 'Bem-Estar'];

function ContentLibrary() {
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('Todos');

    const filteredContent = useMemo(() => {
        return contentData.filter(item => {
            const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
            const matchesSearch = searchTerm === '' || 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.summary.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);


    if (selectedItem) {
        return (
            <div className="space-y-8 animate-fadeIn">
                <button onClick={() => setSelectedItem(null)} className="flex items-center space-x-2 font-semibold text-text-secondary hover:text-text-primary transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar para a Biblioteca</span>
                </button>
                <Card>
                    <span className={`text-sm font-bold uppercase ${selectedItem.type === 'article' ? 'text-blue-500' : 'text-red-500'}`}>{selectedItem.category}</span>
                    <h1 className="text-3xl font-bold my-2 text-text-primary">{selectedItem.title}</h1>
                    {selectedItem.type === 'video' ? (
                        <div className="aspect-w-16 aspect-h-9 mt-4 rounded-lg overflow-hidden">
                            <iframe 
                                src={selectedItem.videoUrl}
                                title={selectedItem.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-96"
                            ></iframe>
                        </div>
                    ) : (
                        <p className="mt-4 text-text-secondary leading-relaxed">{selectedItem.content}</p>
                    )}
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Biblioteca de Conteúdo</h1>
                <p className="text-text-secondary mt-1">Aprenda com nossos artigos e vídeos para aprimorar sua jornada.</p>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                         <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input 
                            type="text"
                            placeholder="Buscar por título ou tema..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 bg-background p-1 rounded-xl">
                        {categories.map(category => (
                             <button 
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeCategory === category ? 'bg-primary text-white shadow' : 'text-text-secondary hover:bg-surface'}`}
                             >
                                {category}
                             </button>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                {filteredContent.length > 0 ? filteredContent.map(item => (
                    <Card key={item.id} className="p-0 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
                       <div className={`w-full md:w-1/4 flex items-center justify-center p-6 ${item.type === 'article' ? 'bg-blue-500' : 'bg-red-500'}`}>
                            {item.type === 'article' ? <BookOpenIcon className="w-16 h-16 text-white"/> : <VideoCameraIcon className="w-16 h-16 text-white"/>}
                       </div>
                       <div className="p-6 flex-1">
                            <span className="text-sm font-bold uppercase text-primary">{item.category}</span>
                            <h2 className="text-xl font-bold text-text-primary mt-1">{item.title}</h2>
                            <p className="text-text-secondary mt-2 text-sm">{item.summary}</p>
                       </div>
                    </Card>
                )) : (
                    <Card className="text-center py-10">
                        <h3 className="text-xl font-bold text-text-primary">Nenhum conteúdo encontrado</h3>
                        <p className="text-text-secondary mt-2">Tente ajustar sua busca ou filtro.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ContentLibrary;
