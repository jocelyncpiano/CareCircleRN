import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, ScrollView, View } from 'react-native';
import { useStore } from '../models/store';
import { FunctioningLevel, firstName } from '../models/types';
import { colors, font } from '../theme';
import { SquirrelMascot } from '../mascot/SquirrelMascot';
import { Acorn } from '../mascot/Acorn';
import {
  Card,
  Icon,
  IconBubble,
  PrimaryButton,
  Row,
  Screen,
  SecondaryButton,
  T,
} from '../ui';
import {
  VisitDeckCard,
  lightEndCard,
  lightSupportDeck,
  moreSupportDeck,
  orderVisitDeck,
  visitKindMeta,
  visitTips,
} from '../visit/visitContent';

type Stage = 'opener' | 'card';

const endVisitCard = moreSupportDeck.find((card) => card.id === 'end-positive')!;
const visitFooterStyle = {
  paddingHorizontal: 24,
  paddingBottom: 28,
  paddingTop: 4,
  gap: 10,
};

export function VisitModeScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const level = store.profile.level;
  const first = firstName(store.profile);

  // The deck is ordered adaptively per visit: a weighted shuffle at the start
  // (planned/brought cards float up, order varies each time, and no run of the
  // same kind or of single-step cards clusters back-to-back). Built in begin().
  const [order, setOrder] = useState<VisitDeckCard[]>([]);

  const [stage, setStage] = useState<Stage>('opener');
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [openBranch, setOpenBranch] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [showWrapUp, setShowWrapUp] = useState(false);
  const [closingPage, setClosingPage] = useState<'wrapup' | 'ending'>('wrapup');
  const [closingHome, setClosingHome] = useState(false);

  const card = order[index];
  const isLastCard = index >= order.length - 1;
  const isLastStep = card ? step >= card.steps.length - 1 : false;
  const isConversationGuide = card?.id.startsWith('q-') ?? false;
  const usesBranchLayout = !!card && (card.steps.length >= 3 || (card.kind === 'activity' && card.steps.length === 2));

  const begin = () => {
    const deck = level === 'late'
      ? moreSupportDeck.filter((candidate) => candidate.id !== endVisitCard.id)
      : lightSupportDeck;
    setOrder(
      orderVisitDeck(deck, store.visitReactions, store.plannedActivities)
    );
    setIndex(0);
    setStep(0);
    setOpenBranch(null);
    setShowWrapUp(false);
    setClosingPage('wrapup');
    setClosingHome(false);
    setStage('card');
  };

  const openWrapUp = () => {
    setClosingPage('wrapup');
    setClosingHome(false);
    setShowWrapUp(true);
  };

  const advanceCard = () => {
    if (isLastCard) {
      openWrapUp();
      return;
    }
    setIndex((i) => i + 1);
    setStep(0);
    setOpenBranch(null);
  };

  // Tapping "Next": step through the card, then move on to the next card.
  const onNext = () => {
    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }
    advanceCard();
  };

  // Skipping the card entirely.
  const onSkipCard = () => {
    advanceCard();
  };

  if (stage === 'opener') {
    return (
      <Opener
        first={first}
        level={level}
        onBegin={begin}
        onCancel={() => nav.goBack()}
      />
    );
  }

  if (!card) {
    // Empty deck safeguard.
    return (
      <Screen>
        <T center color={colors.secondary} style={{ marginTop: 48 }}>
          Nothing to show yet.
        </T>
        <View style={{ marginTop: 24 }}>
          <PrimaryButton title="Close" onPress={() => nav.goBack()} />
        </View>
      </Screen>
    );
  }

  const meta = visitKindMeta[card.kind];
  const current = card.steps[step];

  return (
    <Screen scroll={false}>
      {/* Header: end visit + tips */}
      <Row between align="center" style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4 }}>
        <Pressable onPress={openWrapUp} hitSlop={8}>
          <T color={colors.secondary} weight="600">
            End visit
          </T>
        </Pressable>
        {level === 'late' && (
          <Pressable onPress={() => setShowTips(true)} hitSlop={8}>
            <Row gap={4} align="center">
              <Icon name="bulb" size={16} color={colors.orange} />
              <T color={colors.orange} weight="600">
                Tips
              </T>
            </Row>
          </Pressable>
        )}
      </Row>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card kind + title */}
        <Row gap={12} align="center">
          <IconBubble name={meta.icon} color={meta.color} size={44} iconSize={24} />
          <View style={{ flex: 1 }}>
            <T color={meta.color} weight="700" size={font.footnote}>
              {meta.label.toUpperCase()}
            </T>
            <T weight="800" size={font.title} style={{ lineHeight: font.title + 4 }}>
              {card.title}
            </T>
          </View>
        </Row>

        {!!card.bring && (
          <Row gap={8} align="flex-start" style={{ marginTop: 16 }}>
            <Icon name="bag-handle-outline" size={16} color={colors.secondary} style={{ marginTop: 2 }} />
            <T color={colors.secondary} size={font.subhead} style={{ flex: 1, lineHeight: 22 }}>
              {card.bring}
            </T>
          </Row>
        )}

        {/* Step dot bar (only for cards using the original sequential flow) */}
        {card.steps.length > 1 && !usesBranchLayout && (
          <Row gap={8} style={{ marginTop: 24 }}>
            {card.steps.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setStep(i)}
                style={{
                  height: 6,
                  flex: 1,
                  borderRadius: 999,
                  backgroundColor: i === step ? meta.color : colors.hairline,
                }}
              />
            ))}
          </Row>
        )}

        {/* Step content */}
        {card.steps.length > 1 && !usesBranchLayout && (
          <T weight="700" size={font.footnote} color={meta.color} style={{ marginTop: 16 }}>
            {current.heading.toUpperCase()}
          </T>
        )}
        <Card style={{ marginTop: card.steps.length > 1 && !usesBranchLayout ? 12 : 24 }}>
          {usesBranchLayout && (
            <T weight="700" size={font.footnote} color={meta.color} style={{ marginBottom: 8 }}>
              {(isConversationGuide ? 'An opening question' : card.steps[0].heading).toUpperCase()}
            </T>
          )}
          <T color={colors.secondaryStrong} size={font.body} style={{ lineHeight: 26 }}>
            {usesBranchLayout ? card.steps[0].body : current.body}
          </T>
        </Card>

        {usesBranchLayout && (
          <View style={{ marginTop: 20, gap: 10 }}>
            {card.steps.slice(1, 3).map((branch, branchIndex) => {
              const branchStep = branchIndex + 1;
              const isOpen = openBranch === branchStep;
              return (
                <View key={branch.heading}>
                  <Pressable
                    onPress={() => setOpenBranch(isOpen ? null : branchStep)}
                    className="active:opacity-80"
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 15,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isOpen ? meta.color : colors.hairline,
                      backgroundColor: isOpen ? meta.color + '12' : colors.background,
                    }}
                  >
                    <T weight="700" color={isOpen ? meta.color : colors.secondaryStrong} style={{ flex: 1, marginRight: 12 }}>
                      {isConversationGuide && branchStep === 2
                        ? 'A natural response'
                        : branch.heading}
                    </T>
                    <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={isOpen ? meta.color : colors.secondary} />
                  </Pressable>
                  {isOpen && (
                    <T color={colors.secondaryStrong} style={{ lineHeight: 24, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
                      {branch.body}
                    </T>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Step nav (only when the card has more than one step) */}
        {card.steps.length > 1 && !usesBranchLayout && (
          <Row between align="center" style={{ marginTop: 32 }}>
            {step > 0 ? (
              <Pressable onPress={() => setStep(step - 1)} hitSlop={10}>
                <Row gap={4}>
                  <Icon name="chevron-back" size={20} color={colors.secondary} />
                  <T color={colors.secondary} weight="700">
                    Previous
                  </T>
                </Row>
              </Pressable>
            ) : (
              <View />
            )}
            <T color={colors.tertiary} weight="700" size={font.footnote}>
              {step + 1} of {card.steps.length}
            </T>
          </Row>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={visitFooterStyle}>
        <PrimaryButton
          title={usesBranchLayout ? 'On to the next' : isLastStep ? 'Next' : 'Next step'}
          color={meta.color}
          height={68}
          titleSize={24}
          onPress={usesBranchLayout ? advanceCard : onNext}
        />
        <SecondaryButton title="Skip this one" titleSize={17} onPress={onSkipCard} />
      </View>

      <Modal visible={level === 'late' && showTips} animationType="slide" presentationStyle="pageSheet">
        <TipsSheet onClose={() => setShowTips(false)} />
      </Modal>

      <Modal
        visible={showWrapUp}
        animationType={closingHome ? 'none' : 'slide'}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          if (closingPage === 'ending') return;
          setShowWrapUp(false);
        }}
        onDismiss={() => {
          if (closingHome) nav.popToTop();
        }}
      >
        {closingPage === 'wrapup' ? (
          <VisitWrapUp
            card={level === 'late' ? endVisitCard : lightEndCard}
            onEnd={() => {
              store.completeVisit();
              store.clearPlannedActivities();
              setClosingPage('ending');
            }}
            onResume={() => setShowWrapUp(false)}
          />
        ) : (
          <ClosingPageEntrance>
            <EndVisit
              first={first}
              level={level}
              onConfirm={() => {
                setClosingHome(true);
                requestAnimationFrame(() => setShowWrapUp(false));
              }}
            />
          </ClosingPageEntrance>
        )}
      </Modal>
    </Screen>
  );
}

// MARK: - Opener

function Opener({
  first,
  level,
  onBegin,
  onCancel,
}: {
  first: string;
  level: FunctioningLevel;
  onBegin: () => void;
  onCancel: () => void;
}) {
  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <SquirrelMascot size={104} />
        <T size={font.section} weight="800" center style={{ marginTop: 20, lineHeight: font.section + 4 }}>
          Time with {first}!
        </T>
        <T color={colors.secondary} center style={{ marginTop: 12, lineHeight: 24 }}>
          {level === 'late'
            ? "Ideas will keep coming until you tap 'End visit.' Try the ones that fit, skip the rest, and stay with anything that holds their attention."
            : "Ideas will keep coming until you tap 'End visit.' For conversation cards, ask one question, then follow what they choose to talk about instead of working through a list."}
        </T>

        {/* Bookend flourish that mirrors the End-visit screen. */}
        <Row gap={12} align="center" style={{ marginTop: 28 }}>
          <View style={{ width: 28, height: 1, backgroundColor: colors.hairline }} />
          <Acorn size={28} />
          <View style={{ width: 28, height: 1, backgroundColor: colors.hairline }} />
        </Row>
      </View>

      <View style={visitFooterStyle}>
        <PrimaryButton title="Begin" height={68} titleSize={24} onPress={onBegin} />
        <SecondaryButton title="Not now" titleSize={17} onPress={onCancel} />
      </View>
    </Screen>
  );
}

// MARK: - End visit

function ClosingPageEntrance({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(56)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateX]);

  return (
    <Animated.View style={{ flex: 1, opacity, transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
}

function VisitWrapUp({
  card,
  onEnd,
  onResume,
}: {
  card: VisitDeckCard;
  onEnd: () => void;
  onResume: () => void;
}) {
  const [openBranch, setOpenBranch] = useState<number | null>(null);
  const meta = visitKindMeta[card.kind];

  return (
    <Screen scroll={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Row gap={12} align="center">
          <IconBubble name={meta.icon} color={meta.color} size={44} iconSize={24} />
          <View style={{ flex: 1 }}>
            <T color={meta.color} weight="700" size={font.footnote}>
              {meta.label.toUpperCase()}
            </T>
            <T weight="800" size={font.title} style={{ lineHeight: font.title + 4 }}>
              {card.title}
            </T>
          </View>
        </Row>

        <Card style={{ marginTop: 24 }}>
          <T weight="700" size={font.footnote} color={meta.color} style={{ marginBottom: 8 }}>
            {card.steps[0].heading.toUpperCase()}
          </T>
          <T color={colors.secondaryStrong} size={font.body} style={{ lineHeight: 26 }}>
            {card.steps[0].body}
          </T>
        </Card>

        <View style={{ marginTop: 20, gap: 10 }}>
          {card.steps.slice(1, 3).map((branch, branchIndex) => {
            const branchStep = branchIndex + 1;
            const isOpen = openBranch === branchStep;
            return (
              <View key={branch.heading}>
                <Pressable
                  onPress={() => setOpenBranch(isOpen ? null : branchStep)}
                  className="active:opacity-80"
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isOpen ? meta.color : colors.hairline,
                    backgroundColor: isOpen ? meta.color + '12' : colors.background,
                  }}
                >
                  <T weight="700" color={isOpen ? meta.color : colors.secondaryStrong} style={{ flex: 1, marginRight: 12 }}>
                    {branch.heading}
                  </T>
                  <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={isOpen ? meta.color : colors.secondary} />
                </Pressable>
                {isOpen && (
                  <T color={colors.secondaryStrong} style={{ lineHeight: 24, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
                    {branch.body}
                  </T>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={visitFooterStyle}>
        <PrimaryButton title="End visit" color={meta.color} height={68} titleSize={24} onPress={onEnd} />
        <SecondaryButton title="Keep visiting" titleSize={17} onPress={onResume} />
      </View>
    </Screen>
  );
}

function EndVisit({
  first,
  level,
  onConfirm,
}: {
  first: string;
  level: FunctioningLevel;
  onConfirm: () => void;
}) {
  const moreSupport = level === 'late';
  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <SquirrelMascot size={112} celebrate />
        <T size={font.section} weight="800" center style={{ marginTop: 20, lineHeight: font.section + 4 }}>
          Give yourself a pat on the back!
        </T>
        <T color={colors.secondary} center style={{ marginTop: 12, lineHeight: 24 }}>
          {moreSupport
            ? `You showed up for ${first} and made time to be together. Nicely done — pick up where you left off next time.`
            : `You made time to catch up with ${first} today. Nicely done — there will be plenty more to talk about next time.`}
        </T>

        {/* Quiet "chapter-end" flourish: the squirrel's acorn between two hairlines. */}
        <Row gap={12} align="center" style={{ marginTop: 28 }}>
          <View style={{ width: 28, height: 1, backgroundColor: colors.hairline }} />
          <Acorn size={28} />
          <View style={{ width: 28, height: 1, backgroundColor: colors.hairline }} />
        </Row>
      </View>

      <View style={visitFooterStyle}>
        <PrimaryButton title="Back home" height={68} titleSize={24} onPress={onConfirm} />
        <View style={{ height: 44 }} />
      </View>
    </Screen>
  );
}

// MARK: - Tips sheet (reactive "if X happens, try Y" help)

function TipsSheet({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const color = colors.orange;

  return (
    <Screen>
      <Row between align="flex-start" style={{ marginTop: 8 }}>
        <T size={font.title} weight="800" style={{ flex: 1, marginRight: 16, lineHeight: font.title + 4 }}>
          If something comes up
        </T>
        <Pressable onPress={onClose} hitSlop={10}>
          <T color={colors.teal} weight="700">
            Done
          </T>
        </Pressable>
      </Row>

      <T
        color={colors.secondaryStrong}
        size={font.body}
        style={{ marginTop: 12, marginBottom: 24, lineHeight: 26 }}
      >
        Choose what is happening for a few practical things to try.
      </T>

      {visitTips.map((tip, i) => {
        const isOpen = open === i;
        return (
          <Card key={tip.id} className="mb-3" onPress={() => setOpen(isOpen ? null : i)}>
            <Row gap={12} align="center">
              <IconBubble name={tip.icon} color={color} size={40} iconSize={22} />
              <T weight="800" size={font.headline} style={{ flex: 1, lineHeight: font.headline + 4 }}>
                {tip.situation}
              </T>
              <Icon
                name={isOpen ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={colors.tertiary}
              />
            </Row>
            {isOpen && (
              <View style={{ marginTop: 12, paddingLeft: 4, gap: 10 }}>
                {tip.moves.map((move, m) => (
                  <Row key={m} gap={8} align="flex-start">
                    <Icon name="ellipse" size={7} color={color} style={{ marginTop: 8 }} />
                    <T color={colors.secondaryStrong} size={font.body} style={{ flex: 1, lineHeight: 26 }}>
                      {move}
                    </T>
                  </Row>
                ))}
              </View>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}
