import React from 'react';

export const ChatMessageRenderer: React.FC<{ text: string }> = ({ text }) => {
    // 處理粗體 **text**
    const renderBold = (line: string) => {
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    // 將文本按換行符分割
    const lines = text.split('\n');
    // FIX: Changed JSX.Element to React.ReactNode to resolve namespace error.
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 my-2">
                    {listItems.map((item, i) => (
                        <li key={i}>{renderBold(item)}</li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        // 檢查是否為條列項目
        if (line.match(/^\s*[-*]\s/)) {
            listItems.push(line.replace(/^\s*[-*]\s/, ''));
        } else {
            // 如果不是條列，先將之前的列表輸出
            flushList();
            // 處理一般段落
            if (line.trim()) {
                 elements.push(<p key={`p-${index}`}>{renderBold(line)}</p>);
            }
        }
    });

    // 處理最後可能存在的列表
    flushList();

    return <div className="space-y-2">{elements}</div>;
};
