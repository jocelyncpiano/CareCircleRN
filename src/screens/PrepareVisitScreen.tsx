import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, font } from '../theme';
import { GradientButton, Screen, T } from '../ui';

export function PrepareVisitScreen() {
  const nav = useNavigation<any>();

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 24,
        }}
      >
        <T size={font.title} weight="800" style={{ lineHeight: font.title + 4 }}>
          Prepare for a visit
        </T>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <T color={colors.teal} weight="700">
            Done
          </T>
        </Pressable>
      </View>

      <T
        color={colors.secondaryStrong}
        size={font.body}
        style={{ marginTop: 12, lineHeight: 24 }}
      >
        Get a starting point for what to say, what to bring, and how to adjust
        if the visit goes differently than expected.
      </T>

      {/* TRYOUT (color personality): accent bar + colored label instead of the
          gray uppercase caption. Revert = restore the single <T>LEARN</T>. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 32, marginBottom: 12 }}>
        <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: colors.orange }} />
        <T color={colors.orange} weight="800" size={font.footnote} style={{ letterSpacing: 0.5 }}>
          LEARN
        </T>
      </View>
      <View style={{ gap: 16 }}>
        <GradientButton
          title="The power of a visit"
          subtitle="What face-to-face time can offer"
          icon="heart"
          color={colors.orange}
          onPress={() => nav.navigate('WhyVisits')}
        />
        <GradientButton
          title="What a visit looks like"
          subtitle="How to open, respond, and close"
          icon="map"
          color={colors.orange}
          onPress={() => nav.navigate('VisitFlow')}
        />
        <GradientButton
          title="What to talk about"
          subtitle="Questions and stories to bring"
          icon="bulb"
          color={colors.orange}
          onPress={() => nav.navigate('HowToPrep', { section: 'mindset' })}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 36, marginBottom: 12 }}>
        <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: colors.teal }} />
        <T color={colors.teal} weight="800" size={font.footnote} style={{ letterSpacing: 0.5 }}>
          PLAN
        </T>
      </View>
      <View style={{ gap: 16 }}>
        <GradientButton
          title="Plan your activities"
          subtitle="Pick what you’ll do and bring"
          icon="color-palette"
          color={colors.teal}
          onPress={() => nav.navigate('HowToPrep', { section: 'activities' })}
        />
      </View>
    </Screen>
  );
}
