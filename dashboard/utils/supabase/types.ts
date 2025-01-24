export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bales: {
        Row: {
          id: number
          processingstatus: number | null
          wastetype: number | null
          weight: number | null
        }
        Insert: {
          id?: number
          processingstatus?: number | null
          wastetype?: number | null
          weight?: number | null
        }
        Update: {
          id?: number
          processingstatus?: number | null
          wastetype?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bales_processingstatus_fkey"
            columns: ["processingstatus"]
            isOneToOne: false
            referencedRelation: "processingstatustypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bales_wastetype_fkey"
            columns: ["wastetype"]
            isOneToOne: false
            referencedRelation: "wastetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      barcodeidtobales: {
        Row: {
          assignedat: string | null
          baleid: number | null
          barcodeid: number | null
          id: number
          unassignedat: string | null
        }
        Insert: {
          assignedat?: string | null
          baleid?: number | null
          barcodeid?: number | null
          id?: number
          unassignedat?: string | null
        }
        Update: {
          assignedat?: string | null
          baleid?: number | null
          barcodeid?: number | null
          id?: number
          unassignedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barcodeidtobales_baleid_fkey"
            columns: ["baleid"]
            isOneToOne: false
            referencedRelation: "bales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barcodeidtobales_barcodeid_fkey"
            columns: ["barcodeid"]
            isOneToOne: false
            referencedRelation: "barcodes"
            referencedColumns: ["id"]
          },
        ]
      }
      barcodes: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      childbales: {
        Row: {
          childbaleid: number | null
          id: number
          parentbaleid: number | null
          parentweight: number | null
        }
        Insert: {
          childbaleid?: number | null
          id?: number
          parentbaleid?: number | null
          parentweight?: number | null
        }
        Update: {
          childbaleid?: number | null
          id?: number
          parentbaleid?: number | null
          parentweight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "childbales_childbaleid_fkey"
            columns: ["childbaleid"]
            isOneToOne: false
            referencedRelation: "bales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "childbales_parentbaleid_fkey"
            columns: ["parentbaleid"]
            isOneToOne: false
            referencedRelation: "bales"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          companytypeid: number | null
          id: number
          name: string | null
        }
        Insert: {
          companytypeid?: number | null
          id?: number
          name?: string | null
        }
        Update: {
          companytypeid?: number | null
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_companytypeid_fkey"
            columns: ["companytypeid"]
            isOneToOne: false
            referencedRelation: "companytypes"
            referencedColumns: ["id"]
          },
        ]
      }
      companytypes: {
        Row: {
          companytype: string | null
          id: number
        }
        Insert: {
          companytype?: string | null
          id?: number
        }
        Update: {
          companytype?: string | null
          id?: number
        }
        Relationships: []
      }
      eoltypes: {
        Row: {
          id: number
          type: string | null
        }
        Insert: {
          id?: number
          type?: string | null
        }
        Update: {
          id?: number
          type?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          city: string | null
          companyid: number | null
          country: string | null
          id: number
          locationx: number | null
          locationy: number | null
          name: string | null
          state: string | null
          type: number | null
        }
        Insert: {
          city?: string | null
          companyid?: number | null
          country?: string | null
          id?: number
          locationx?: number | null
          locationy?: number | null
          name?: string | null
          state?: string | null
          type?: number | null
        }
        Update: {
          city?: string | null
          companyid?: number | null
          country?: string | null
          id?: number
          locationx?: number | null
          locationy?: number | null
          name?: string | null
          state?: string | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_companyid_fkey"
            columns: ["companyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facilities_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "facilitytypes"
            referencedColumns: ["id"]
          },
        ]
      }
      facilitytypes: {
        Row: {
          facilitytype: string | null
          id: number
        }
        Insert: {
          facilitytype?: string | null
          id?: number
        }
        Update: {
          facilitytype?: string | null
          id?: number
        }
        Relationships: []
      }
      processes: {
        Row: {
          companyid: number
          createdat: string
          facilityid: number
          id: number
          processtype: number
          terminatedat: string | null
        }
        Insert: {
          companyid: number
          createdat: string
          facilityid: number
          id?: number
          processtype: number
          terminatedat?: string | null
        }
        Update: {
          companyid?: number
          createdat?: string
          facilityid?: number
          id?: number
          processtype?: number
          terminatedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processes_companyid_fkey"
            columns: ["companyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_facilityid_fkey"
            columns: ["facilityid"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_processtype_fkey"
            columns: ["processtype"]
            isOneToOne: false
            referencedRelation: "processtypes"
            referencedColumns: ["id"]
          },
        ]
      }
      processingstatustypes: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      processrelations: {
        Row: {
          addedat: string
          baleid: number
          endedat: string | null
          processid: number
          processrelationshiptype: number
        }
        Insert: {
          addedat: string
          baleid: number
          endedat?: string | null
          processid: number
          processrelationshiptype: number
        }
        Update: {
          addedat?: string
          baleid?: number
          endedat?: string | null
          processid?: number
          processrelationshiptype?: number
        }
        Relationships: [
          {
            foreignKeyName: "processrelations_baleid_fkey"
            columns: ["baleid"]
            isOneToOne: false
            referencedRelation: "bales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processrelations_processid_fkey"
            columns: ["processid"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processrelations_processrelationshiptype_fkey"
            columns: ["processrelationshiptype"]
            isOneToOne: false
            referencedRelation: "processrelationshiptypes"
            referencedColumns: ["id"]
          },
        ]
      }
      processrelationshiptypes: {
        Row: {
          id: number
          processrelationshiptype: string
        }
        Insert: {
          id?: number
          processrelationshiptype: string
        }
        Update: {
          id?: number
          processrelationshiptype?: string
        }
        Relationships: []
      }
      processtypes: {
        Row: {
          id: number
          processtype: string
        }
        Insert: {
          id?: number
          processtype: string
        }
        Update: {
          id?: number
          processtype?: string
        }
        Relationships: []
      }
      remanufacturingrates: {
        Row: {
          companyid: number
          facilityid: number
          materialid: number
          recyclingrate: number | null
          year: number
        }
        Insert: {
          companyid: number
          facilityid: number
          materialid: number
          recyclingrate?: number | null
          year: number
        }
        Update: {
          companyid?: number
          facilityid?: number
          materialid?: number
          recyclingrate?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "remanufacturingrates_companyid_fkey"
            columns: ["companyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remanufacturingrates_facilityid_fkey"
            columns: ["facilityid"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remanufacturingrates_materialid_fkey"
            columns: ["materialid"]
            isOneToOne: false
            referencedRelation: "wastetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          id: number
          inputbale: number | null
          inputcompany: number | null
          inputfacility: number | null
          outputbale: number | null
          outputcompany: number | null
          outputfacility: number | null
          percent: number | null
          time: string | null
          transactiontype: number | null
        }
        Insert: {
          id?: number
          inputbale?: number | null
          inputcompany?: number | null
          inputfacility?: number | null
          outputbale?: number | null
          outputcompany?: number | null
          outputfacility?: number | null
          percent?: number | null
          time?: string | null
          transactiontype?: number | null
        }
        Update: {
          id?: number
          inputbale?: number | null
          inputcompany?: number | null
          inputfacility?: number | null
          outputbale?: number | null
          outputcompany?: number | null
          outputfacility?: number | null
          percent?: number | null
          time?: string | null
          transactiontype?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_inputbale_fkey"
            columns: ["inputbale"]
            isOneToOne: false
            referencedRelation: "bales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_inputcompany_fkey"
            columns: ["inputcompany"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_inputfacility_fkey"
            columns: ["inputfacility"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_outputbale_fkey"
            columns: ["outputbale"]
            isOneToOne: false
            referencedRelation: "bales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_outputcompany_fkey"
            columns: ["outputcompany"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_outputfacility_fkey"
            columns: ["outputfacility"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_transactiontype_fkey"
            columns: ["transactiontype"]
            isOneToOne: false
            referencedRelation: "transactiontypes"
            referencedColumns: ["id"]
          },
        ]
      }
      transactiontypes: {
        Row: {
          id: number
          type: string | null
        }
        Insert: {
          id?: number
          type?: string | null
        }
        Update: {
          id?: number
          type?: string | null
        }
        Relationships: []
      }
      user_groups: {
        Row: {
          companyid: number | null
          user_id: string | null
        }
        Insert: {
          companyid?: number | null
          user_id?: string | null
        }
        Update: {
          companyid?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_groups_companyid_fkey"
            columns: ["companyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      wastequantity_monthly_facilitypartner: {
        Row: {
          accounted: number
          companyid: number
          facilityid: number
          partnercompanyid: number
          partnerfacilityid: number
          quantity: number
          timerange: string
          wastetype: number
        }
        Insert: {
          accounted?: number
          companyid: number
          facilityid: number
          partnercompanyid: number
          partnerfacilityid: number
          quantity?: number
          timerange: string
          wastetype: number
        }
        Update: {
          accounted?: number
          companyid?: number
          facilityid?: number
          partnercompanyid?: number
          partnerfacilityid?: number
          quantity?: number
          timerange?: string
          wastetype?: number
        }
        Relationships: [
          {
            foreignKeyName: "wastequantity_monthly_facilitypartner_companyid_fkey"
            columns: ["companyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wastequantity_monthly_facilitypartner_facilityid_fkey"
            columns: ["facilityid"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wastequantity_monthly_facilitypartner_partnercompanyid_fkey"
            columns: ["partnercompanyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wastequantity_monthly_facilitypartner_partnerfacilityid_fkey"
            columns: ["partnerfacilityid"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wastequantity_monthly_facilitypartner_wastetype_fkey"
            columns: ["wastetype"]
            isOneToOne: false
            referencedRelation: "wastetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      wasterates_monthly_facilitypartner: {
        Row: {
          companyid: number
          facilityid: number
          parentwastetype: number
          partnercompanyid: number
          partnerfacilityid: number
          processed: number
          recycled: number
          timerange: string
          wastetype: number
        }
        Insert: {
          companyid: number
          facilityid: number
          parentwastetype: number
          partnercompanyid: number
          partnerfacilityid: number
          processed?: number
          recycled?: number
          timerange: string
          wastetype: number
        }
        Update: {
          companyid?: number
          facilityid?: number
          parentwastetype?: number
          partnercompanyid?: number
          partnerfacilityid?: number
          processed?: number
          recycled?: number
          timerange?: string
          wastetype?: number
        }
        Relationships: [
          {
            foreignKeyName: "wasterates_monthly_facilitypartner_companyid_fkey"
            columns: ["companyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wasterates_monthly_facilitypartner_facilityid_fkey"
            columns: ["facilityid"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wasterates_monthly_facilitypartner_partnercompanyid_fkey"
            columns: ["partnercompanyid"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wasterates_monthly_facilitypartner_partnerfacilityid_fkey"
            columns: ["partnerfacilityid"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wasterates_monthly_facilitypartner_wastetype_fkey"
            columns: ["wastetype"]
            isOneToOne: false
            referencedRelation: "wastetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      wastetypes: {
        Row: {
          display_color: string | null
          id: number
          name: string | null
        }
        Insert: {
          display_color?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          display_color?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
