import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import { useStore } from '../models/store';
import { ComfortSong, uuid } from '../models/types';
import { colors, font } from '../theme';
import { Card, Icon, PrimaryButton, Screen, SecondaryButton, T } from '../ui';

export function SongsScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const [editing, setEditing] = useState<ComfortSong | null>(null);
  const [adding, setAdding] = useState(false);
  const first = store.profile.name.split(' ')[0];

  const songs = [...store.comfortSongs].sort(
    (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
  );

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
        Songs {first} knows
      </T>
      <T color={colors.secondary} className="mt-1 mb-4">
        A familiar tune can reach someone when words and photos can't.
      </T>

      {songs.map((s) => (
        <Card key={s.id} className="mb-3 rounded-md">
          <View className="flex-row items-center gap-3">
            <Icon name="musical-note" size={22} color={colors.teal} />
            <Pressable className="flex-1" onPress={() => setEditing(s)}>
              <T weight="700">{s.title}</T>
              {!!s.artist && (
                <T color={colors.secondary} size={font.subhead}>
                  {s.artist}
                </T>
              )}
              {!!s.note && (
                <T color={colors.secondary} size={font.subhead} className="mt-0.5">
                  {s.note}
                </T>
              )}
            </Pressable>
            <Pressable
              hitSlop={10}
              onPress={() => store.updateComfortSong({ ...s, isFavorite: !s.isFavorite })}
            >
              <Icon
                name={s.isFavorite ? 'star' : 'star-outline'}
                size={22}
                color={s.isFavorite ? colors.orange : colors.tertiary}
              />
            </Pressable>
          </View>
        </Card>
      ))}

      {songs.length === 0 && (
        <T color={colors.secondary} center className="mt-8">
          No songs yet. Tap + to add one {first} loves.
        </T>
      )}

      <SongEditor
        visible={adding || editing != null}
        song={editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
        onSave={(s) => {
          if (editing) store.updateComfortSong(s);
          else store.addComfortSong(s);
          setAdding(false);
          setEditing(null);
        }}
        onDelete={
          editing
            ? () => {
                store.deleteComfortSong(editing);
                setEditing(null);
              }
            : undefined
        }
      />
    </Screen>
  );
}

function SongEditor({
  visible,
  song,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  song: ComfortSong | null;
  onClose: () => void;
  onSave: (s: ComfortSong) => void;
  onDelete?: () => void;
}) {
  const [title, setTitle] = useState(song?.title ?? '');
  const [artist, setArtist] = useState(song?.artist ?? '');
  const [note, setNote] = useState(song?.note ?? '');

  useEffect(() => {
    setTitle(song?.title ?? '');
    setArtist(song?.artist ?? '');
    setNote(song?.note ?? '');
  }, [song, visible]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <Screen>
        <View className="flex-row justify-between items-center">
          <T size={font.headline} weight="800">
            {song ? 'Edit song' : 'New song'}
          </T>
          <Pressable onPress={onClose} hitSlop={10}>
            <T color={colors.secondary}>Cancel</T>
          </Pressable>
        </View>

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          TITLE
        </T>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Moon River"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
        />
        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          ARTIST (OPTIONAL)
        </T>
        <TextInput
          value={artist}
          onChangeText={setArtist}
          placeholder="e.g. Frank Sinatra"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
        />
        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-4 mb-2 tracking-[0.5px]">
          WHY IT MATTERS (OPTIONAL)
        </T>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Who it reminds them of, where it's from…"
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-body text-ink"
          style={{ minHeight: 80 }}
          multiline
        />

        <PrimaryButton
          title="Save"
          disabled={title.trim().length === 0}
          className="mt-6"
          onPress={() =>
            onSave({
              id: song?.id ?? uuid(),
              title: title.trim(),
              artist: artist.trim(),
              note: note.trim(),
              voiceMemoFileName: song?.voiceMemoFileName,
              dateAdded: song?.dateAdded ?? new Date().toISOString(),
              isFavorite: song?.isFavorite ?? false,
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
