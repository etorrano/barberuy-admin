import { Card, CardContent } from "@/components/ui/card"

export default function CardContainer(props: any) {
 return (
    <Card className="rounded-lg border-none mt-6 h-full">
      <CardContent className="p-6">
        { props.children }
      </CardContent>
    </Card>
 )
}