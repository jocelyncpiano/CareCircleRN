import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import { useStore } from '../models/store';
import {
  MemoryCard,
  MemoryCategory,
  memoryCategories,
  memoryCategoryLabel,
  uuid,
} from '../models/types';
import { colors, font } from '../theme';
import { Badge, Card, Icon, PrimaryButton, Screen, SecondaryButton, T } from '../ui';

export function MemoriesScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const [editing, setEditing] = useState<MemoryCard | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <Screen>
      <View className="flex-row justify-between items-center">
        <Pressable onPress={() => nav.goBack()} hitSlop={10} className="flex-row items-center">
          <Icon name="chevron-back" size={22} color={colors.teal} />
          <T color={colors.teal}>Story</T>
        </Pressable>
        <Pressable onPress={() => setAdding(true)} hitSlop={10}>
          <Icon name="add-circle" size={28} color={colors.teal} />
        </Pressable>
      </View>

      <T size={font.title} weight="800" className="mt-2">
        Memories
      </T>
      <T color={colors.secondary} className="mt-1 mb-4">
        Little stories to tell — a place, a song, a moment worth revisiting.
      </T>

      {store.memoryCards.map((m) => (
        <Card key={m.id} className="mb-3 rounded-md" onPress={() => setEditing(m)}>
          <Badge label={memoryCategoryLabel[m.category]} />
          <T weight="700" className="mt-2">
            {m.title}
          </T>
          <T color={colors.secondary} className="mt-1">
            {m.story}
          </T>
        </Card>
      ))}

      <MemoryEditor
        visible={adding || editing != null}
        memory={editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
        onSave={(m) => {
          if (editing) store.updateMemory(m);
          else store.addMemory(m);
          setAdding(false);
          setEditing(null);
        }}
        onDelete={
          editing
            ? () => {
                store.deleteMemory(editing);
                setEditing(null);
              }
            : undefined
        }
      />
    </Screen>
  );
}

function MemoryEditor({
  visible,
  memory,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  memory: MemoryCard | null;
  onClose: () => void;
  onSave: (m: MemoryCard) => void;
  onDelete?: () => void;
}) {
  const [category, setCategory] = useState<MemoryCategory>(memory?.category ?? 'story');
  const [title, setTitle] = useState(memory?.title ?? '');
  const [story, setStory] = useState(memory?.story ?? '');
  const [prompt, setPrompt] = useState(memory?.prompt ?? '');

  useEffect(() => {
    setCategory(memory?.category ?? 'story');
    setTitle(memory?.title ?? '');
    setStory(memory?.story ?? '');
    setPrompt(memory?.prompt ?? '');
  }, [memory, visible]);

  const canSave = title.trim().length > 0 && story.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <Screen>
        <View className="flex-row justify-between items-center">
          <T size={font.headline} weight="800">
            {memory ? 'Edit memory' : 'New memory'}
          </T>
          <Pressable onPress={onClose} hitSlop={10}>
            <T color={colors.secondary}>Cancel</T>
          </Pressable>
        </View>

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          CATEGORY
        </T>
        <View className="flex-row flex-wrap gap-2">
          {memoryCategories.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              className={`px-3 py-2 rounded-full border ${
                category === c ? 'bg-teal border-teal' : 'bg-card border-hairline'
              }`}
            >
              <T
                size={font.subhead}
                weight="600"
                color={category === c ? colors.white : colors.ink}
              >
                {memoryCategoryLabel[c]}
              </T>
            </Pressable>
          ))}
        </View>

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          TITLE
        </T>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. The lake house"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
        />

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          STORY
        </T>
        <TextInput
          value={story}
          onChangeText={setStory}
          placeholder="What happened, in a sentence or two"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
          style={{ minHeight: 80 }}
          multiline
        />

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          GENTLE PROMPT (OPTIONAL)
        </T>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="e.g. Shall we look at this one together?"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
        />

        <PrimaryButton
          title="Save"
          disabled={!canSave}
          className="mt-6"
          onPress={() =>
            onSave({
              id: memory?.id ?? uuid(),
              category,
              title: title.trim(),
              story: story.trim(),
              prompt: prompt.trim(),
              photoFileName: memory?.photoFileName,
              voiceMemoFileName: memory?.voiceMemoFileName,
              captures: memory?.captures ?? [],
            })
          }
        />
        {onDelete && (
          <SecondaryButton title="Delete" color={colors.indigo} onPress={onDelete} />
        )}
      </Screen>
    </Modal>
  );
}
