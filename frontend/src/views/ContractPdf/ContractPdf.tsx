import React, {useEffect} from 'react'
import { Document, Page, Text, Font, StyleSheet, View } from '@react-pdf/renderer'
import { PDFViewer } from '@react-pdf/renderer';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "../../redux/rootReducer";
import {loadContractItem} from "../../redux/actions/contractAction";
import {RouteComponentProps} from "react-router";
import {loadOrganization} from "../../redux/actions/organizationAction";
import {Table, TableBody, TableCell, DataTableCell, TableHeader} from '@david.kucsai/react-pdf-table'
import {MoneyToStr, Currency, Language, Pennies} from 'helpers/moneytostr'


interface ContractPdfProps extends RouteComponentProps{
    className: string,
    match: any
}

const ContractPdf = (props: ContractPdfProps) => {

    const dispatch = useDispatch()

    const paramId = props.match.params.id;
    const contractId = paramId === 'new' ? 0 :parseInt(paramId);

    const contractItem = useSelector((state: IStateInterface) => state.contract.contractItem)
    const requisites = useSelector((state: IStateInterface) => state.org.org)
    const moneyToStr = new MoneyToStr(Currency.KZT, Language.KAZ, Pennies.NUMBER);


    useEffect(() => {
        dispatch(loadContractItem(contractId))
        dispatch(loadOrganization())
    }, [dispatch, contractId]);


    /**
     * Подсчитать сумму договора
     */
    function getTotalSumContract() {

        return contractItem.specs
            .map(({itemTotal, itemDiscount}) => itemTotal - itemDiscount)
            .reduce((sum, i)=> sum+i, 0)
    }

    return (

        <div id="row" style={{height: "100vh", width: "100vw", display: "flex", overflow: "hidden"}}>
            <PDFViewer width={'90%'} >
                <Document>
                    <Page size="A4" style={styles.body}>
                        <Text style={styles.header} fixed>
                            <Text style={styles.title}></Text>
                        </Text>
                        <Text style={styles.title}>
                            Договор поставки № {contractItem.num}
                        </Text>
                        <Text style={styles.author}></Text>
                        <Text style={styles.subtitle}>

                        </Text>
                        <Text style={styles.text}>
                            Мы, <Text style={{ fontFamily: 'Arial-Bold' }}>ТОО «АгроХимПрогресс»</Text>, именуемое в дальнейшем <Text style={{ fontFamily: 'Arial-Bold' }}>Поставщик</Text>, в лице Даниловой Арины Игоревны, действующей на основании доверенности №10/6 от 10 июня 2020 г., с одной стороны, и
                            <Text style={{ fontFamily: 'Arial-Bold' }}>{contractItem.client.clientName}</Text>, именуемое в дальнейшем <Text style={{ fontFamily: 'Arial-Bold' }}>Покупатель</Text>, в лице директора {contractItem.client.reqBoss}, действующей на основании Устава, с другой стороны, совместно именуемые стороны, заключили настоящий договор о нижеследующем:
                        </Text>

                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                1. Предмет договора{"\n"}
                            </Text>
                            1.1. Поставщик обязуется поставить, а Покупатель обязуется принять и оплатить средства защиты растений, далее по тексту - Товар, на условиях, оговоренных в настоящем договоре.{"\n"}
                            1.2. Наименование (ассортимент), техническая характеристика, количество, цена, общая стоимость поставляемого Товара, порядок и форма оплаты, способ поставки, размер платежа за доставку Товара согласовываются сторонами в спецификациях, являющихся неотъемлемой частью настоящего договора.{"\n"}
                            1.3. Все Спецификации, Приложения, дополнительные соглашения к настоящему договору являются его неотъемлемой частью.
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                2. Цена товара, форма и порядок оплаты{"\n"}
                            </Text>
                            2.1. Установленная цена Товара согласовывается сторонами в Спецификации.{"\n"}
                            2.2. Оплата за поставленный Товар осуществляются внесением наличных в кассу или путем перечисления денежных средств на расчетный счет Поставщика либо на иной расчетный счет, указанный Покупателю Поставщиком в письменной форме. Обязательство Покупателя по оплате считается исполненным в момент зачисления денежных средств на счет Поставщика либо внесением денежных средств в кассу Поставщика.{"\n"}
                            2.3. Покупатель производит оплату Товара наличными деньгами в полном соответствии с п.9 ст.25 Закона РК «О платежах и платёжных системах», а именно - платежи по сделке, сумма которой превышает тысячекратный размер месячного расчетного показателя, установленного законом о республиканском бюджете и действующего на дату совершения платежа, осуществляются индивидуальными предпринимателями, состоящими на регистрационном учете в качестве плательщика налога на добавленную стоимость, или юридическими лицами в пользу другого индивидуального предпринимателя, состоящего на регистрационном учете в качестве плательщика налога на добавленную стоимость, или юридического лица только в безналичном порядке.{"\n"}
                            2.4. До передачи Поставщиком Товара Покупатель осуществляет предварительную оплату полностью или частично в срок, предусмотренный в Спецификации.{"\n"}
                            2.5. Срок окончательного расчета за поставленный Товар предусматривается в Спецификации, за несвоевременный или неполный расчет Покупатель несет ответственность в соответствии с п. 6.3. настоящего Договора.
                        </Text>

                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                            3. Качество Товара. Тара и упаковка{"\n"}
                        </Text>
                            3.1. Поставляемый Товар по своему качеству должен соответствовать всем нормам и Правилам, действующим на территории Республики Казахстан, а также иметь регистрационное удостоверение.{"\n"}
                            3.2. Товар поставляется в таре, позволяющей его транспортировать без потерь и повреждений при условии надлежащего обращения при доставке.{"\n"}
                            3.3. Всю тару от использования средств защиты растений Покупатель самостоятельно, за свой счет обязан возвратить Поставщику по адресу: г. Павлодар, Северная промышленная зона, строение 115/1, для дальнейшей утилизации, согласно порядка, установленного законодательством РК.{"\n"}
                            3.4. В случае невозврата тары от использования средств защиты растений Покупатель самостоятельно, за свой счет обязан утилизировать, согласно порядка, установленного законодательством РК.
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                4. Порядок и условия поставки Товара{"\n"}
                            </Text>
                            4.1. Местом получения Товара по настоящему договору является склад Поставщика, указанный в спецификации к настоящему договору.{"\n"}
                            4.2. Выборка (приёмка) Товара, его вывоз со склада Поставщика осуществляется Покупателем на условиях самовывоза собственными силами и средствами.{"\n"}
                            4.3. По согласованию сторон Товар может быть доставлен до места нахождения Покупателя Поставщиком (либо третьим лицом).{"\n"}
                            4.4. Условия поставки товара отражаются в спецификации.{"\n"}
                            4.5. Приёмка Товара по количеству производится при передаче Товара от Поставщика к Покупателю с обязательным составлением накладной на отпуск запасов на сторону.{"\n"}
                            4.6. Приёмка Товара по качеству производится Покупателем в течение тридцати календарных дней с даты подписания сторонами накладной на отпуск запасов на сторону. По истечении указанного срока претензии по качеству Товара не принимаются.{"\n"}
                            4.7. Претензии Покупателя по качеству Товара принимаются Поставщиком, только при наличии у покупателя протокола испытаний на данный вид товара выданный аккредитованной лабораторией с соблюдением условий п.4.5. настоящего договора.{"\n"}
                            4.8. Датой поставки Товара считается дата составления накладной на отпуск запасов на сторону.{"\n"}
                            4.9. В день поставки Товара Поставщик обязуется предоставить Покупателю следующие документы:{"\n"}
                            1) накладная на отпуск запасов на сторону;{"\n"}
                            2) товарно-транспортная накладная;{"\n"}
                            4.10. В день поставки Товара Покупатель обязуется предоставить Поставщику следующие документы:{"\n"}
                            1) оригинал доверенности, выданной Покупателем на лицо, уполномоченное для получения Товара (уполномоченный представитель Покупателя);{"\n"}
                            2) копию удостоверения личности уполномоченного представителя Покупателя;{"\n"}
                            3) вторые экземпляры подписанных документов в оригинале по настоящему договору.{"\n"}
                            4.11. Поставка Товара может быть осуществлена Поставщиком частями по согласованию с Покупателем, что отражается в спецификациях к настоящему договору.{"\n"}
                            4.12. Право собственности на поставленный Покупателю Товар переходит к Покупателю в момент подписания сторонами  накладной на отпуск Товара.{"\n"}
                            4.13. Покупатель обязан за 3 (три) рабочих дня до планируемой выборки (приёмки) Товара уведомить Поставщика средствами телефонной, факсимильной, либо интернет связи о дате выборки (приемки) Товара.{"\n"}
                            4.14.  Поставщик вправе не передавать Товар Покупателю при отсутствии у Поставщика предоплаты за Товар от Покупателя и следующих документов Покупателя:{"\n"}
                            1) должным образом оформленной доверенности на представителя Покупателя на получение Товара;{"\n"}
                            2) удостоверения личности поверенного/уполномоченного представителя Покупателя.{"\n"}
                            4.15. В случае нарушения Покупателем пп. 4.13., 4.14. договора, Покупатель не имеет право предъявлять какие – либо претензии к Поставщику по непоставке и/или нарушении сроков поставки Товара, а также Поставщик освобождается от взыскания с него Покупателем неустойки, убытков, ущерба связанных с вышеуказанным нарушением Покупателем условий договора.{"\n"}
                            4.16. Поставщик вправе в любое время отказаться от исполнения настоящего договора, полностью, либо в части, не неся при этом никакой ответственности перед Покупателем, в случае невнесения/несвоевременного внесения Покупателем оплаты за товар в соответствии с условиями настоящего договора.{"\n"}
                            4.17. По соглашению сторон, товар может быть возвращён Поставщику в объёме и наименовании, согласованном сторонами.{"\n"}
                            4.17.1. Покупатель возвращает товар, целый, без каких-либо повреждений самого товара и упаковки, годный для применения.{"\n"}
                            4.17.2. При обнаружении каких-либо повреждений товара либо упаковки товар возврату не подлежит, а Покупатель обязан оплатить за него сумму, указанную в спецификации.{"\n"}
                            4.17.3. Прием-передача возвратного товара оформляется дополнительным соглашением к настоящему Договору, накладной на отпуск товара и актом возврата товара.
                        </Text>

                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                5. Обязанности и права сторон{"\n"}
                                5.1. Поставщик обязан:{"\n"}
                            </Text>

                            5.1.1. поставить Покупателю Товар в соответствии с условиями настоящего договора;{"\n"}
                            5.1.2. удовлетворить обоснованные письменно требования Покупателя в случае выявления им при приёмке (выборке) Товара несоответствия или недостатков по количеству и качеству, ассортименту, комплектности, таре, и только при условии незамедлительного сообщения об этом Покупателем Поставщику;{"\n"}
                            5.1.3. соблюдать условия настоящего договора;{"\n"}
                            5.1.4. нести ответственность за качество поставляемого Товара, при соблюдении Покупателем всех правил и норм применения, транспортировки и хранения препаратов/Товара.
                        </Text>

                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                5.2. Покупатель обязан:{"\n"}
                            </Text>
                            5.2.1. совершить все необходимые действия, обеспечивающие принятие Товара;{"\n"}
                            5.2.2. при принятии Товара осмотреть его, проверить количество, ассортимент, комплектность, целостность тары, и о выявленных несоответствиях или недостатках незамедлительно письменно уведомить Поставщика;{"\n"}
                            5.2.3. своевременно, в соответствии с условиями настоящего договора, произвести все платежи, предусмотренные настоящим договором, в том числе возместить понесенные Поставщиком убытки;{"\n"}
                            5.2.4. надлежащим образом и в кратчайшие сроки оформить всю документацию, связанную с приёмкой Товара;{"\n"}
                            5.2.5. соблюдать условия настоящего договора;{"\n"}
                            5.2.6. произвести выборку Товара и вывезти его со склада Поставщика в период отгрузки Товара в соответствии со сроком/периодом указанном в спецификациях;{"\n"}
                            5.2.7. нести ответственность за несоблюдение правил и норм применения, транспортировки (при самовывозе Товара) и хранения препаратов/Товара;{"\n"}
                            5.2.8. при приобретении Товара с рассрочкой платежа, Покупатель, являющийся сельскохозяйственным товаропроизводителем, в течение 3 (трех) календарных дней с даты подписания настоящего договора, либо с даты  принятия документов в программу субсидирования, обязан подать в уполномоченный орган переводную заявку в соответствии со стандартом государственной услуги «Субсидирование стоимости гербицидов, биоагентов и  биопрепаратов, предназначенных для обработки сельскохозяйственных культур в целях защиты растений».{"\n"}
                            5.2.9. направить Поставщику подтверждение подачи заявки и результат оказания государственной услуги посредством электронной почты, заказным письмом, факсом, либо иным способом в течение 3 (трех) календарных дней со дня их получения.
                        </Text>

                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                5.3. Покупатель вправе:{"\n"}
                            </Text>
                            5.3.1. отказаться от принятия Товара, только в случае вины Поставщика, выразившейся в отсутствии Товара на складе в период отгрузки, либо несвоевременной поставки товара на склад Покупателя Поставщиком более чем на пять календарных дней. В данном случае Стороны (уполномоченные на то представители Сторон) составляют двухсторонний акт, в котором указывают причину и период времени отсутствия Товара на складе Поставщика. Претензии Покупателя, касаемо несвоевременной отгрузки Товара по вине Поставщика, без предъявления вышеуказанного Акта являются недействительными. В любых иных случаях Покупатель не вправе отказаться от принятия Товара, поставка которого просрочена.
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                6. Ответственность сторон{"\n"}
                            </Text>
                            6.1. Обе стороны несут ответственность за невыполнение либо не надлежащее выполнение условий настоящего договора и, в случае их нарушения, виновная сторона, помимо неустойки (пеня и штраф), предусмотренных настоящим договором, обязана возместить другой стороне все возникшие по её вине убытки.{"\n"}
                            6.2. За недопоставку и/или нарушение сроков поставки Товара Поставщиком, Поставщик обязан выплатить Покупателю пеню в размере 0,5 (ноль пять) % за каждый день просрочки от стоимости не поставленного (недопоставленного) в срок Товара. В случае отсутствия предоплаты Покупателем установленной спецификацией, Поставщик освобождается от ответственности по выплате пени.{"\n"}
                            6.3. В случае неисполнения либо ненадлежащего исполнения обязательств, предусмотренных настоящим договором, Покупатель обязан выплатить Поставщику пеню в размере 1 (один) % за каждый день просрочки платежа от неоплаченной суммы, подлежащей оплате по условиям договора, включая день оплаты этой суммы Покупателем, при этом предельный размер неустойки соглашением сторон не ограничен.{"\n"}
                            6.4. Выплата неустойки (пеня и штрафы) и возмещение убытков не освобождает сторону, нарушившую условия договора, от исполнения своих обязательств в натуре.{"\n"}
                            6.5. В случае невыполнения Покупателем обязанности, предусмотренной п. 5.2.2 договора, Поставщик вправе полностью отказаться от удовлетворения соответствующих требований Покупателя.{"\n"}
                            6.6. В случае одностороннего отказа Покупателем от исполнения обязательств по настоящему договору сумма внесенной предоплаты не возвращается.{"\n"}
                            6.7. Стороны не несут ответственности за нарушение сроков, предусмотренных настоящим договором, если просрочка в выполнении обязательств произошла по согласованию сторон, которое должно быть надлежащим образом оформлено, скреплено подписями уполномоченных представителей сторон и заверено печатями.{"\n"}
                            6.8. Поставщик не несёт ответственности за невыполнение Покупателем своих обязательств перед третьими лицами.{"\n"}
                            6.9. Поставщик не несёт никакой ответственности за какие-либо прямые или косвенные убытки, возникшие у Покупателя в связи с использованием Товара, включая упущенную выгоду и моральный ущерб в случае несоблюдения Покупателем правил (требований) по перевозке, хранению и применению Товара установленных законодательством РК.{"\n"}
                            6.10. В случае нарушения Покупателем п. 5.2.8. настоящего Договор, Покупатель обязан оплатить Поставщику штраф в размере двадцати процентов от общей суммы договора поставки в течение пятнадцати календарных дней.
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                7. Прочие условия{"\n"}
                            </Text>
                            7.1. Настоящий договор считается заключенным со дня его подписания обеими сторонами и действует до 31.12.2020 года, а в части взаиморасчётов до момента окончания исполнения сторонами обязательств.{"\n"}
                            7.2. Договор и все приложения к нему действительны и имеют юридическую силу, как в оригинале, так и при заключении путём передачи (обмена), по электронной почте, указанной в п.8 настоящего договора, с последующим предоставлением оригиналов не позднее 15 (пятнадцати) календарных дней с момента подписания.{"\n"}
                            7.3. При изменении исполнительного органа ТОО, платежных реквизитов, почтовых и/или юридических адресов, фактического местонахождения сторон, уведомление о таком изменении каждая из сторон обязана направить другой стороне письменно в течение пяти календарных дней с момента вышеуказанных изменений.{"\n"}
                            7.4. Все сообщения, претензии и уведомления, направляемые сторонами друг другу в соответствии или в связи с настоящим договором, должны быть составлены на русском языке и направлены сторонам следующими способами: по факсу, по электронной почте, указанной в п.8 настоящего договора, заказным письмом с уведомлением о вручении или курьером по указанным адресам, по средством мессенджеров (messenger), либо sms сообщением.{"\n"}
                            7.5. Все споры и разногласия, требования, возникающие в связи с договором или касающегося его нарушения, не решенные путём переговоров сторон, подлежат окончательному разрешению в Павлодарском арбитраже при ТОО «Судебный Альянс», решение которого будет являться обязательным для сторон, в случае если Павлодарский арбитраж при ТОО «Судебный Альянс» не сможет по какой либо причине принять и рассмотреть спор, Стороны по соглашению между собой согласовали, что споры и разногласия в связи с этой ситуацией будут рассматриваться в  Специализированном межрайонном экономическом суде Павлодарской области.{"\n"}
                            7.6. Настоящий договор составлен на русском языке, на трёх листах. Договор отпечатан в двух подлинных экземплярах, Поставщику – один экземпляр, Покупателю – один экземпляра.{"\n"}
                            7.7. К настоящему договору Покупатель прилагает документы, удостоверяющие регистрацию Покупателя в уполномоченных государственных органах, а также документы, подтверждающие полномочия лиц, заключающих настоящий договор.
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.firstLevel}>
                                8. Адреса и банковские реквизиты сторон{"\n"}
                            </Text>

                        </Text>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.text}>
                                    <Text style={styles.firstLevel}>
                                    Поставщик{"\n"}
                                    </Text>
                                    {requisites.name}{"\n"}
                                    Адрес: {requisites.addrReg}{"\n"}
                                    БИН: {requisites.reqBin}{"\n"}
                                    ИИК: {requisites.reqAccount}{"\n"}
                                    {requisites.reqBank}{"\n"}
                                    БИК: {requisites.reqBik}{"\n"}
                                    тел/факс: {requisites.contactPhone} {requisites.contactFax}{"\n"}
                                    email: {requisites.contactEmail}{"\n"}
                                    _____________________ {requisites.bossName}{"\n\n"}
                                    м.п.
                                </Text>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.text}>
                                    <Text style={styles.firstLevel}>
                                        Покупатель{"\n"}
                                    </Text>
                                    {contractItem.client.clientName}{"\n"}
                                    Адрес: {contractItem.client.clientAddr}{"\n"}
                                    БИН: {contractItem.client.reqBin}{"\n"}
                                    ИИК: {contractItem.client.reqAccount}{"\n"}
                                    {contractItem.client.reqBank}{"\n"}
                                    БИК: {contractItem.client.reqBik}{"\n"}
                                    тел/факс: {contractItem.client.contactPhone} {contractItem.client.contactFax}{"\n"}
                                    email: {contractItem.client.contactEmail}{"\n"}
                                    _____________________ {contractItem.client.reqBoss}{"\n\n"}
                                    м.п.
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.pageNumber} fixed>
                            Место парафирования Поставщиком ______________             Место парафирования Покупателем: ________________
                        </Text>
                    </Page>
                    <Page size="A4" style={styles.body}>
                        <Text style={styles.text} break>
                            <Text style={styles.title}>
                                Спецификация № {"\n"} к договору поставки № {contractItem.num} от {contractItem.contractDate} года
                            </Text>
                        </Text>
                        <Text style={styles.text}>
                            Мы, ТОО «АгроХимПрогресс», именуемое в дальнейшем Поставщик, в лице Даниловой Арины Игоревны, действующей на основании доверенности №10/6 от 10 июня 2020 г., с одной стороны, и
                            <Text style={styles.firstLevel}>
                                {contractItem.client.clientName}
                            </Text>, именуемое в дальнейшем Покупатель, в лице директора {contractItem.client.clientEmployee}, действующей на основании Устава, с другой стороны, совместно именуемые стороны, заключили настоящий договор о нижеследующем:{"\n"}
                            1. В соответствии с условиями договора № {contractItem.num} от {contractItem.contractDate} года (далее по тексту - Договор) Поставщик обязуется поставить, а Покупатель принять и оплатить Товар, указанный в нижеприведённой таблице:
                        </Text>
                        <Table
                            data={contractItem.specs}
                        >
                            <TableHeader>
                                <TableCell style={styles.tableHeader}>
                                    Наименование и техническая характеристика товара
                                </TableCell>
                                <TableCell style={styles.tableHeader}>
                                    Ед. изм.
                                </TableCell>
                                <TableCell style={styles.tableHeader}>
                                    Кол-во
                                </TableCell>
                                <TableCell style={styles.tableHeader}>
                                    Цена прайс,тенге
                                </TableCell>
                                <TableCell style={styles.tableHeader}>
                                    Скидка, тенге
                                </TableCell>
                                <TableCell style={styles.tableHeader}>
                                    Цена с учетом скидки (с НДС), тенге
                                </TableCell>
                                <TableCell style={styles.tableHeader}>
                                    Стоимость с учетом скидки (с НДС), тенге
                                </TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={styles.tableText} getContent={(r) => r.product.name}/>
                                <DataTableCell style={styles.tableText} getContent={(r) => r.tare.unit.name}/>
                                <DataTableCell style={styles.tableText} getContent={(r) => r.itemCount}/>
                                <DataTableCell style={styles.tableText} getContent={(r) => r.itemPrice}/>
                                <DataTableCell style={styles.tableText} getContent={(r) => r.product.name}/>
                                <DataTableCell style={styles.tableText} getContent={(r) => r.product.name}/>
                                <DataTableCell style={styles.tableText} getContent={(r) => r.product.name}/>
                            </TableBody>
                        </Table>
                        <Text style={styles.text}>
                            2. Общая стоимость Товара, поставляемого по настоящей спецификации, составляет <Text style={styles.firstLevel}>{moneyToStr.convert(getTotalSumContract(), 0)}</Text>.{"\n"}
                            3. За поставляемый Товар Покупатель обязуется оплатить Поставщику Общую стоимость Товара в следующем порядке:{"\n"}
                            4. Срок поставки Товара: партиями до {contractItem.estDelivery} г. при условии оплаты согласно пункта 3 спецификации.{"\n"}
                            5. Способ доставки Товара: {contractItem.deliveryTerms}{"\n"}
                        </Text>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.text}>
                                    _____________________ {requisites.bossName}{"\n\n"}
                                    м.п.
                                </Text>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.text}>
                                    _____________________ {contractItem.client.reqBoss}{"\n\n"}
                                    м.п.
                                </Text>
                            </View>
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </div>
    )
};

Font.register({ family: 'Arial', src: '/fonts/Calibri_Regular.ttf' });
Font.register({ family: 'Arial-Bold', src: '/fonts/Arial-Bold.ttf' });

const styles = StyleSheet.create({
    body: {
        paddingTop: 15,
        paddingBottom: 45,
        paddingHorizontal: 35,
        paddingLeft: 15,
        paddingRight: 15
    },
    title: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Arial-Bold'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Arial'
    },
    text: {
        margin: 12,
        fontSize: 10,
        textAlign: 'justify',
        fontFamily: 'Arial'
    },
    firstLevel: {
        fontSize: 10,
        fontFamily: 'Arial-Bold'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
        fontFamily: 'Arial'
    },
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    view: {
        width: '100%',
        height: '100%',
        padding: 0,
        backgroundColor: 'white',
    },
    row: {
        display: "flex",
        flexDirection: "row"
    },
    column: {
        width: "50%",
        padding: "10px"
    },
    tableHeader: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Arial'
    },
    tableText: {
        fontSize: 10,
        fontFamily: 'Arial'
    }


});

export default ContractPdf