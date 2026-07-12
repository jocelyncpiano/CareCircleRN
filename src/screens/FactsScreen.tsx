import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import { useStore } from '../models/store';
import {
  LifeCategory,
  LifeFact,
  lifeCategories,
  lifeCategoryMeta,
  uuid,
} from '../models/types';
import { colors, font } from '../theme';
import { Badge, Card, Icon, PrimaryButton, Screen, SecondaryButton, T } from '../ui';

export function FactsScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const [editing, setEditing] = useState<LifeFact | null>(null);
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
        Facts
      </T>
      <T color={colors.secondary} className="mt-1 mb-4">
        Small, true things — questions with the answers, so nobody's put on the
        spot.
      </T>

      {store.lifeFacts.map((f) => (
        <Card key={f.id} className="mb-3 rounded-md" onPress={() => setEditing(f)}>
          <Badge label={lifeCategoryMeta[f.category].label} />
          <T weight="700" className="mt-2">
            {f.question}
          </T>
          <T color={colors.secondary} className="mt-1">
            {f.answer}
          </T>
        </Card>
      ))}

      {store.lifeFacts.length === 0 && (
        <T color={colors.secondary} center className="mt-8">
          No facts yet. Tap + to add the first one.
        </T>
      )}

      <FactEditor
        visible={adding || editing != null}
        fact={editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
        onSave={(f) => {
          if (editing) store.updateLifeFact(f);
          else store.addLifeFact(f);
          setAdding(false);
          setEditing(null);
        }}
        onDelete={
          editing
            ? () => {
                store.deleteLifeFact(editing);
                setEditing(null);
              }
            : undefined
        }
      />
    </Screen>
  );
}

function FactEditor({
  visible,
  fact,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  fact: LifeFact | null;
  onClose: () => void;
  onSave: (f: LifeFact) => void;
  onDelete?: () => void;
}) {
  const [category, setCategory] = useState<LifeCategory>(fact?.category ?? 'family');
  const [question, setQuestion] = useState(fact?.question ?? '');
  const [answer, setAnswer] = useState(fact?.answer ?? '');

  React.useEffect(() => {
    setCategory(fact?.category ?? 'family');
    setQuestion(fact?.question ?? '');
    setAnswer(fact?.answer ?? '');
  }, [fact, visible]);

  const canSave = question.trim().length > 0 && answer.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <Screen>
        <View className="flex-row justify-between items-center">
          <T size={font.headline} weight="800">
            {fact ? 'Edit fact' : 'New fact'}
          </T>
          <Pressable onPress={onClose} hitSlop={10}>
            <T color={colors.secondary}>Cancel</T>
          </Pressable>
        </View>

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          CATEGORY
        </T>
        <View className="flex-row flex-wrap gap-2">
          {lifeCategories.map((c) => (
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
                {lifeCategoryMeta[c].label}
              </T>
            </Pressable>
          ))}
        </View>

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          QUESTION
        </T>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="e.g. Where did you grow up?"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
        />

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          ANSWER
        </T>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder="The answer, in their words"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
          style={{ minHeight: 80 }}
          multiline
        />

        <PrimaryButton
          title="Save"
          disabled={!canSave}
          className="mt-6"
          onPress={() =>
            onSave({
              id: fact?.id ?? uuid(),
              category,
              question: question.trim(),
              answer: answer.trim(),
              photoFileName: fact?.photoFileName,
              voiceMemoFileName: fact?.voiceMemoFileName,
              lastReviewedAt: fact?.lastReviewedAt,
              captures: fact?.captures ?? [],
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
