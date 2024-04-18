import { StyleSheet, Text, View, TextInput } from 'react-native';
import { CartesianChart, Line, useChartPressState } from "victory-native";
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated'
import { Circle, useFont } from '@shopify/react-native-skia';
import { format } from  'date-fns'

const DATA = [
  { day: new Date("2024-04-09").getTime(), price: 600 },
  { day: new Date("2024-04-10").getTime(), price: 500 },
  { day: new Date("2024-04-11").getTime(), price: 630 },
  { day: new Date("2024-04-12").getTime(), price: 420 },
  { day: new Date("2024-04-13").getTime(), price: 900 },
  { day: new Date("2024-04-14").getTime(), price: 940 },
  { day: new Date("2024-04-15").getTime(), price: 820.90 },
  { day: new Date("2024-04-18").getTime(), price: 1520 },
]

Animated.addWhitelistedNativeProps({ text: true })
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

export default function App() {
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 }})
  const font = useFont(require("./src/fonts/Roboto-Regular.ttf"))


  const animatedText = useAnimatedProps(() => {
    return {
      text: `R$ ${state.y.price.value.value.toFixed(2)}`,
      defaultValue: ""
    }
  })

  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `R$ ${date.toLocaleDateString("pt-BR")}`,
      defaultValue: ""
    }
  })


  return (
    <View style={styles.container}>
      <View style={{ width: '100%', height: 350 }}>
        {isActive && (
          <View>
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={"transparent"}
              style={{ fontSize: 30, fontWeight: 'bold', color: "#000" }}
              animatedProps={animatedText}
            ></AnimatedTextInput>

            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={"transparent"}
              animatedProps={animatedDateText}
            ></AnimatedTextInput>

          </View>
        )}

        {!isActive && (
          <View>
             <Text
               style={{ fontSize: 30, fontWeight: 'bold', color: "#000" }}
             >
              R${DATA[DATA.length - 1].price.toFixed(2)}
             </Text>
             <Text
             >
              Hoje
             </Text>
          </View>
        )}

        <CartesianChart 
          data={DATA} xKey="day" yKeys={["price"]}
          chartPressState={state}
          axisOptions={{
            tickCount: 5,
            font: font,
            labelOffset: { x: 3, y: 2},
            labelPosition: "inset",
            formatYLabel: (value) => `${value}` ,
            formatXLabel: (value) => format(new Date(), "MM/yy")
          }}
        >
            {({ points }) => (
              <>
                <Line points={points.price} color="blue" strokeWidth={4} />
                {isActive && (
                  <ToolTip x={state.x.position} y={state.y.price.position} />
                )}
              </>
            )}
        </CartesianChart>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
